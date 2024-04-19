import { constants } from '../../../constants.js'
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
    services: () => Promise<Services> | Services
): { before: () => Promise<Try<T>> } {
    const {
        application = constants.namespace,
        environment = constants.environment,
        name = constants.serviceName,
        profile,
    } = options
    const maxAge = profile?.maxAge ?? 5
    const appConfigDataClient = memoize(async () => {
        const s = await services()
        return s?.appConfigData ?? createAppConfigData()
    })

    const appConfig = new AppConfigProvider({
        application: application,
        environment: environment,
    })

    return {
        before: async (): Promise<Try<T>> => {
            if (profile !== undefined) {
                appConfig.client = await appConfigDataClient()

                const json = Buffer.from((await appConfig.get<string>(name, { maxAge })) ?? '{}').toString()
                const parsed: unknown = parseJSON(json)
                if (!profile.schema.is(parsed)) {
                    throw EventError.validation({ errors: profile.schema.errors, location: 'profile', statusCode: 500 })
                }
                return parsed
            }
            return {} as T
        },
    }
}
