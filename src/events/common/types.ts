import type { SetRequired } from '@skyleague/axioms/types'
import type { DynamoDBStreamHandler } from '../dynamodb/types.js'
import type { EventBridgeHandler } from '../eventbridge/types.js'
import type { FirehoseTransformationHandler } from '../firehose/types.js'
import type { HTTPHandler } from '../http/types.js'
import type { KinesisHandler } from '../kinesis/types.js'
import type { RawHandler } from '../raw/types.js'
import type { S3BatchHandler } from '../s3-batch/types.js'
import type { S3Handler } from '../s3/types.js'
import type { SecretRotationHandler } from '../secret-rotation/types.js'
import type { SNSHandler } from '../sns/types.js'
import type { SQSHandler } from '../sqs/types.js'
import type { DefaultServices } from '../types.js'

export type EventHandler<Service = unknown> =
    | EventBridgeHandler
    | FirehoseTransformationHandler
    | HTTPHandler
    | KinesisHandler
    | RawHandler
    | S3BatchHandler
    | S3Handler
    | SNSHandler
    | SQSHandler
    | DynamoDBStreamHandler
    | (Service extends SetRequired<DefaultServices, 'secretsManager'> ? SecretRotationHandler<unknown, Service> : never)
