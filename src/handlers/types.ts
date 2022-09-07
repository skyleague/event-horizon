import type {
    HttpHandler,
    KinesisHandler,
    RawHandler,
    SnsHandler,
    SecretRotationServices,
    SecretRotationHandler,
    EventBridgeHandler,
    FirehoseTransformationHandler,
    SQSHandler,
} from '../events'

export type EventHandler<C = unknown, S = unknown> =
    | EventBridgeHandler
    | FirehoseTransformationHandler
    | HttpHandler
    | KinesisHandler
    | RawHandler
    | SnsHandler
    | SQSHandler
    | (S extends SecretRotationServices ? SecretRotationHandler<C, S> : never)
