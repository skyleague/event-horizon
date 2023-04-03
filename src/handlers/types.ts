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
} from '../events/index.js'

export type EventHandler<Service = never> =
    | EventBridgeHandler
    | FirehoseTransformationHandler
    | HTTPHandler
    | KinesisHandler
    | RawHandler
    | S3BatchHandler
    | S3Handler
    | SNSHandler
    | SQSHandler
    | (Service extends SecretRotationServices ? SecretRotationHandler<unknown, Service> : never)
