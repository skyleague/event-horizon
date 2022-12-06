import { constants } from '../../constants'
import { EventError } from '../../errors'
import { parseJSON } from '../../parsers/json'
import { createAppConfigData } from '../../services/appconfig'

import type { Try } from '@skyleague/axioms'
import { memoize, ttlCacheResolver } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { AppConfigData } from 'aws-sdk'

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

export function profileHandler<T>(options: ProfileOptions<T>, services: () => Promise<ProfileServices>) {
    const {
        application = constants.namespace,
        environment = constants.environment,
        name = constants.serviceName,
        profile,
    } = options
    const maxAge = profile?.maxAge ?? 5
    const appConfigData = memoize(async () => {
        const s = await services()
        return s.appConfigData ?? createAppConfigData()
    })

    let nextToken: string | undefined
    let configuration: string
    async function getRawConfiguration(): Promise<string> {
        const appConfig = await appConfigData()
        if (nextToken === undefined) {
            const response = await appConfig
                .startConfigurationSession({
                    ApplicationIdentifier: application,
                    EnvironmentIdentifier: environment,
                    ConfigurationProfileIdentifier: name,
                })
                .promise()
            nextToken = response.InitialConfigurationToken!
        }
        const response = await appConfig.getLatestConfiguration({ ConfigurationToken: nextToken }).promise()

        nextToken = response.NextPollConfigurationToken
        const returnedConfiguration = response.Configuration?.toString() ?? ''
        if (returnedConfiguration.length > 0) {
            configuration = returnedConfiguration
        }
        return configuration
    }
    const get = memoize(getRawConfiguration, ttlCacheResolver(maxAge * 1_000))

    return {
        before: async (): Promise<Try<T>> => {
            if (profile !== undefined) {
                const json = await get()
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
