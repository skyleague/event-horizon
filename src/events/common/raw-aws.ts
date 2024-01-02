import type {
    APIGatewayProxyHandler,
    APIGatewayProxyHandlerV2,
    CloudFrontRequestHandler,
    DynamoDBStreamHandler,
    EventBridgeHandler,
    FirehoseTransformationHandler,
    KinesisStreamHandler,
    S3BatchHandler,
    S3Handler,
    ScheduledHandler,
    SecretsManagerRotationHandler,
    SNSHandler,
    SQSHandler,
    Context,
} from 'aws-lambda'

export type AWSLambdaHandler =
    | APIGatewayProxyHandler
    | APIGatewayProxyHandlerV2
    | CloudFrontRequestHandler
    | DynamoDBStreamHandler
    | EventBridgeHandler<string, unknown, void>
    | FirehoseTransformationHandler
    | KinesisStreamHandler
    | S3BatchHandler
    | S3Handler
    | ScheduledHandler
    | ScheduledHandler<string>
    | SecretsManagerRotationHandler
    | SNSHandler
    | SQSHandler

export type LambdaHandler = (payload: unknown, context: Context, cb?: unknown) => unknown

export type RawRequest = Parameters<AWSLambdaHandler>[0] | string
export type RawResponse = ReturnType<AWSLambdaHandler> | unknown
