import type {
    APIGatewayProxyHandler,
    APIGatewayProxyHandlerV2,
    CloudFrontRequestHandler,
    DynamoDBStreamHandler,
    EventBridgeHandler,
    FirehoseTransformationHandler,
    KinesisStreamHandler,
    ScheduledHandler,
    SecretsManagerRotationHandler,
    SNSHandler,
    SQSHandler,
} from 'aws-lambda'

export type AWSLambdaHandler =
    | APIGatewayProxyHandler
    | APIGatewayProxyHandlerV2
    | CloudFrontRequestHandler
    | DynamoDBStreamHandler
    | EventBridgeHandler<string, string, void>
    | FirehoseTransformationHandler
    | KinesisStreamHandler
    | ScheduledHandler
    | ScheduledHandler<string>
    | SecretsManagerRotationHandler
    | SNSHandler
    | SQSHandler

export type RawRequest = Parameters<AWSLambdaHandler>[0]
export type RawResponse = ReturnType<AWSLambdaHandler> | unknown

export type Config<C> = C | (() => C | Promise<C>)
export type Services<C, S> = S | ((config: C) => Promise<S> | S)

export interface HandlerDefinition {
    operationId?: string
    summary?: string
    description?: string
    tags?: string[]
    logEvent?: boolean
    isSensitive?: boolean
}
