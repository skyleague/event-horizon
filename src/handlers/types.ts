import type {
    HttpHandler,
    KinesisHandler,
    RawHandler,
    SnsHandler,
    EventBridgeHandler,
    FirehoseTransformationHandler,
    SQSHandler,
    S3BatchHandler,
    SecretRotationServices,
    SecretRotationHandler,
} from '../events'

export type EventHandler<C = never, S = never> =
    | EventBridgeHandler
    | FirehoseTransformationHandler
    | HttpHandler
    | KinesisHandler
    | RawHandler
    | S3BatchHandler
    | SnsHandler
    | SQSHandler
    | (S extends SecretRotationServices ? SecretRotationHandler<C, S> : never)
