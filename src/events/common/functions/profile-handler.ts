import { appConfigConstants } from '../../../constants.js'
import { EventError } from '../../../errors/event-error/event-error.js'
import { parseJSON } from '../../../parsers/json/json.js'
import { createAppConfigData } from '../../../services/appconfig/appconfig.js'
import type { DefaultServices } from '../../types.js'

import { AppConfigProvider } from '@aws-lambda-powertools/parameters/appconfig'
import type { Try } from '@skyleague/axioms'
import { memoize } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'

export interface ProfileSchema<T> {
    schema: Schema<T>
    maxAge?: number
}

export interface ProfileOptions<T> {
    profile?: ProfileSchema<T>
    application?: string
    environment?: string
    name?: string
}

export function profileHandler<T, Services extends DefaultServices | undefined>(
    options: ProfileOptions<T>,
    services: () => Promise<Services> | Services,
): { before: () => Promise<Try<T>> } {
    const {
        application = appConfigConstants.application,
        environment = appConfigConstants.environment,
        name = appConfigConstants.name,
        profile,
    } = options

    // do not load appconfig when there is no profile defined
    if (profile?.schema === undefined) {
        return {
            before: (): Promise<Try<T>> => {
                return Promise.resolve({}) as Promise<T>
            },
        }
    }

    if (application === undefined || environment === undefined || name === undefined) {
        throw EventError.preconditionFailed(
            'Did not provide configuration parameters to load the AppConfig profile; needed application, environment, and name - but none are found',
            { statusCode: 500 },
        )
    }

    const maxAge = profile?.maxAge ?? 5
    const appConfigDataClient = memoize(async () => {
        const s = await services()
        return s?.appConfigData ?? createAppConfigData()
    })

    const appConfig = new AppConfigProvider({
        application,
        environment,
    })

    return {
        before: async (): Promise<Try<T>> => {
            appConfig.client = await appConfigDataClient()

            const json = Buffer.from((await appConfig.get<string>(name, { maxAge })) ?? '{}').toString()
            const parsed: unknown = parseJSON(json)
            if (!profile.schema.is(parsed)) {
                throw EventError.validation({ errors: profile.schema.errors, location: 'profile', statusCode: 500 })
            }
            return parsed
        },
    }
}
