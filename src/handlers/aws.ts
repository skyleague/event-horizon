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
    | EventBridgeHandler<string, string, void>
    | FirehoseTransformationHandler
    | KinesisStreamHandler
    | S3BatchHandler
    | S3Handler
    | ScheduledHandler
    | ScheduledHandler<string>
    | SecretsManagerRotationHandler
    | SNSHandler
    | SQSHandler

export type LambdaHandler = AWSLambdaHandler | ((payload: unknown, context: Context) => Promise<unknown>)

export type RawRequest = Parameters<AWSLambdaHandler>[0]
export type RawResponse = ReturnType<AWSLambdaHandler> | unknown
