import type {
    APIGatewayProxyEvent,
    APIGatewayProxyEventV2,
    APIGatewayProxyHandler,
    APIGatewayProxyHandlerV2,
    APIGatewayRequestAuthorizerEvent,
    APIGatewayRequestAuthorizerEventV2,
    APIGatewayRequestIAMAuthorizerHandlerV2,
    CloudFrontRequestHandler,
    Context,
    DynamoDBStreamEvent,
    DynamoDBStreamHandler,
    EventBridgeEvent,
    EventBridgeHandler,
    FirehoseTransformationEvent,
    FirehoseTransformationHandler,
    KinesisStreamEvent,
    KinesisStreamHandler,
    S3BatchHandler,
    S3Event,
    S3Handler,
    ScheduledHandler,
    SecretsManagerRotationHandler,
    SNSEvent,
    SNSHandler,
    SQSEvent,
    SQSHandler,
} from 'aws-lambda'
import type { DynamoDBStreamSchema } from '../../aws/dynamodb.js'
import type { EventBridgeSchema } from '../../aws/eventbridge/eventbridge.type.js'
import type { KinesisFirehoseSchema } from '../../aws/firehose.js'
import type { APIGatewayProxyEventV2Schema, APIGatewayRequestAuthorizerEventV2Schema } from '../../aws/http.js'
import type { KinesisDataStreamSchema } from '../../aws/kinesis/kinesis.type.js'
import type { APIGatewayProxyEventSchema, APIGatewayRequestAuthorizerEventSchema } from '../../aws/rest.js'
import type { S3Schema } from '../../aws/s3.js'
import type { SnsSchema } from '../../aws/sns.js'
import type { SqsSchema } from '../../aws/sqs.js'

export type AWSLambdaHandler =
    | APIGatewayProxyHandler
    | APIGatewayProxyHandlerV2
    | APIGatewayRequestIAMAuthorizerHandlerV2
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
          | APIGatewayRequestAuthorizerEvent
          | APIGatewayRequestAuthorizerEventV2
          | S3Event
          | SNSEvent
          | DynamoDBStreamEvent
          | FirehoseTransformationEvent
      >
    | EventBridgeSchema
    | SqsSchema
    | KinesisDataStreamSchema
    | APIGatewayProxyEventSchema
    | APIGatewayProxyEventV2Schema
    | APIGatewayRequestAuthorizerEventSchema
    | APIGatewayRequestAuthorizerEventV2Schema
    | S3Schema
    | SnsSchema
    | DynamoDBStreamSchema
    | KinesisFirehoseSchema
    | string
export type RawResponse = ReturnType<AWSLambdaHandler> | unknown
