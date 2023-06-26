import { constants } from '../../constants.js'
import { EventError } from '../../errors/index.js'
import { parseJSON } from '../../parsers/json/index.js'
import { createAppConfigData } from '../../services/appconfig/index.js'

import { AppConfigProvider } from '@aws-lambda-powertools/parameters/appconfig'
import type { AppConfigData } from '@aws-sdk/client-appconfigdata'
import type { Try } from '@skyleague/axioms'
import { memoize } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'

export interface ProfileServices {
    appConfigData?: AppConfigData
}

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

export function profileHandler<T>(options: ProfileOptions<T>, services: () => Promise<ProfileServices | undefined>) {
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
