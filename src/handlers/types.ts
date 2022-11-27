import type {
    HTTPHandler,
    KinesisHandler,
    RawHandler,
    SNSHandler,
    EventBridgeHandler,
    FirehoseTransformationHandler,
    SQSHandler,
    S3BatchHandler,
    SecretRotationServices,
    SecretRotationHandler,
    S3Handler,
} from '../events'

export type EventHandler<C = never, S = never> =
    | EventBridgeHandler
    | FirehoseTransformationHandler
    | HTTPHandler
    | KinesisHandler
    | RawHandler
    | S3BatchHandler
    | S3Handler
    | SNSHandler
    | SQSHandler
    | (S extends SecretRotationServices ? SecretRotationHandler<C, S> : never)
