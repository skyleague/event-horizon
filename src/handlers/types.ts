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

export type EventHandler<C = never, S = never> =
    | EventBridgeHandler
    | FirehoseTransformationHandler
    | HttpHandler
    | KinesisHandler
    | RawHandler
    | SnsHandler
    | SQSHandler
    | (S extends SecretRotationServices ? SecretRotationHandler<C, S> : never)
