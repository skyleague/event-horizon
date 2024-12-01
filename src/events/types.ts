import type { AppConfigData } from '@aws-sdk/client-appconfigdata'
import type { SecretsManager } from '@aws-sdk/client-secrets-manager'
import type { Context as AWSContext } from 'aws-lambda'
import type { Logger } from '../observability/logger/logger.js'
import type { Metrics } from '../observability/metrics/metrics.js'
import type { Tracer } from '../observability/tracer/tracer.js'
import type { InferFromParser, MaybeGenericParser } from '../parsers/types.js'
import type { AsConfig } from './common/config.js'
import type { ProfileSchema } from './common/functions/profile-handler.js'

export interface DefaultServices {
    [k: PropertyKey]: unknown
    appConfigData?: AppConfigData
    secretsManager?: SecretsManager
}

export interface LambdaContext<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
> {
    logger: Logger
    tracer: Tracer
    metrics: Metrics
    isSensitive: boolean

    traceId: string
    requestId: string

    services: [Service] extends [undefined] ? never : Service
    config: [Configuration] extends [undefined] ? never : AsConfig<Configuration>
    profile: InferFromParser<Profile, never>

    getRemainingTimeInMillis(): number

    raw: AWSContext
}

export interface EventHandlerDefinition<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
> {
    config?: Config<Configuration>
    services?: Services<Configuration, Service>
    profile?: ProfileSchema<Profile>
    operationId?: string
    summary?: string
    description?: string
    deprecated?: boolean
    tags?: string[]
    isSensitive?: boolean
    logger?: Logger
    tracer?: Tracer
    metrics?: Metrics
}

export type Config<C> = C | (() => C | Promise<C>)
export type Services<C, S> = S | ((config: AsConfig<C>) => Promise<S> | S)

export type EventFromHandler<
    Handler extends {
        // biome-ignore lint/suspicious/noExplicitAny: we need to infer the event type
        handler: (event: any, ...args: any[]) => any
    },
> = Handler extends {
    // biome-ignore lint/suspicious/noExplicitAny: we need to infer the event type
    handler: (event: infer EventType, ...args: any[]) => any
}
    ? EventType
    : never
export type ResponseFromHandler<
    Handler extends {
        // biome-ignore lint/suspicious/noExplicitAny: we need to infer the event type
        handler: (event: any, ...args: any[]) => any
    },
> = Handler extends {
    // biome-ignore lint/suspicious/noExplicitAny: we need to infer the event type
    handler: (event: any, ...args: any[]) => infer ResponseType
}
    ? ResponseType
    : never
