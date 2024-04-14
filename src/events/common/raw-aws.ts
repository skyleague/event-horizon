import type { UndefinedOnPartialDeep } from '@skyleague/axioms/types'
import type {
    APIGatewayProxyHandler,
    APIGatewayProxyHandlerV2,
    CloudFrontRequestHandler,
    Context,
    DynamoDBStreamHandler,
    EventBridgeHandler,
    FirehoseTransformationHandler,
    KinesisStreamHandler,
    S3BatchHandler,
    S3Handler,
    SNSHandler,
    SQSHandler,
    ScheduledHandler,
    SecretsManagerRotationHandler,
} from 'aws-lambda'
import type { EventBridgeEvent as AWSEventBridgeEvent } from 'aws-lambda'

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

export type RawRequest = Parameters<AWSLambdaHandler>[0] | UndefinedOnPartialDeep<AWSEventBridgeEvent<string, unknown>> | string
export type RawResponse = ReturnType<AWSLambdaHandler> | unknown
