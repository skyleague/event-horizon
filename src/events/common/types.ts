import type {
    HTTPHandler,
    KinesisHandler,
    RawHandler,
    SNSHandler,
    EventBridgeHandler,
    FirehoseTransformationHandler,
    SQSHandler,
    S3BatchHandler,
    SecretRotationHandler,
    S3Handler,
    DefaultServices,
} from '../index.js'

import type { RequireKeys } from '@skyleague/axioms'

export type EventHandler<Service = unknown> =
    | EventBridgeHandler
    | FirehoseTransformationHandler
    | HTTPHandler
    | KinesisHandler
    | RawHandler
    | S3BatchHandler
    | S3Handler
    | SNSHandler
    | SQSHandler
    | (Service extends RequireKeys<DefaultServices, 'secretsManager'> ? SecretRotationHandler<unknown, Service> : never)
