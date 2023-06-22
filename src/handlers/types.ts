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
    PipesHandler,
} from '../events/index.js'

export type EventHandler<Service = never> =
    | EventBridgeHandler
    | FirehoseTransformationHandler
    | HTTPHandler
    | KinesisHandler
    | PipesHandler
    | RawHandler
    | S3BatchHandler
    | S3Handler
    | Service
    | SNSHandler
    | SQSHandler
    | (Service extends SecretRotationServices ? SecretRotationHandler<unknown, Service> : never)
