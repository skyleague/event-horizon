import type {
    APIGatewayProxyEvent,
    APIGatewayProxyEventV2,
    APIGatewayProxyHandler,
    APIGatewayProxyHandlerV2,
    CloudFrontRequestHandler,
    Context,
    DynamoDBStreamHandler,
    EventBridgeEvent,
    EventBridgeHandler,
    FirehoseTransformationHandler,
    KinesisStreamEvent,
    KinesisStreamHandler,
    S3BatchHandler,
    S3Event,
    S3Handler,
    SNSEvent,
    SNSHandler,
    SQSEvent,
    SQSHandler,
    ScheduledHandler,
    SecretsManagerRotationHandler,
} from 'aws-lambda'
import type { APIGatewayProxyEventV2Schema } from '../../dev/aws/apigateway/http.type.js'
import type { APIGatewayProxyEventSchema } from '../../dev/aws/apigateway/rest.type.js'
import type { EventBridgeSchema } from '../../dev/aws/eventbridge/eventbridge.type.js'
import type { KinesisDataStreamSchema } from '../../dev/aws/kinesis/kinesis.type.js'
import type { S3Schema } from '../../dev/aws/s3/s3.type.js'
import type { SnsSchema } from '../../dev/aws/sns/sns.type.js'
import type { SqsSchema } from '../../dev/aws/sqs/sqs.type.js'

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

export type RawRequest =
    | Exclude<
          Parameters<AWSLambdaHandler>[0],
          | EventBridgeEvent<string, unknown>
          | SQSEvent
          | KinesisStreamEvent
          | APIGatewayProxyEvent
          | APIGatewayProxyEventV2
          | S3Event
          | SNSEvent
      >
    | EventBridgeSchema
    | SqsSchema
    | KinesisDataStreamSchema
    | APIGatewayProxyEventSchema
    | APIGatewayProxyEventV2Schema
    | S3Schema
    | SnsSchema
    | string
export type RawResponse = ReturnType<AWSLambdaHandler> | unknown
