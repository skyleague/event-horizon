/**
 * Generated by @skyleague/therefore@v1.0.0-local
 * Do not manually touch this
 */
/* eslint-disable */

import type { DefinedError, ValidateFunction } from 'ajv'

import { validate as DynamoDBStreamRecordValidator } from './schemas/dynamo-db-stream-record.schema.js'
import { validate as DynamoDBStreamSchemaValidator } from './schemas/dynamo-db-stream-schema.schema.js'

export interface DynamoDBStreamChangeRecord {
    ApproximateCreationDateTime?: number | undefined
    Keys: {
        [k: string]:
            | {
                  [k: string]: unknown
              }
            | undefined
    }
    NewImage?:
        | {
              [k: string]: unknown
          }
        | undefined
    OldImage?:
        | {
              [k: string]: unknown
          }
        | undefined
    SequenceNumber: string
    SizeBytes: number
    StreamViewType: 'NEW_IMAGE' | 'OLD_IMAGE' | 'NEW_AND_OLD_IMAGES' | 'KEYS_ONLY'
}

export interface DynamoDBStreamRecord {
    eventID: string
    eventName: 'INSERT' | 'MODIFY' | 'REMOVE'
    eventVersion: string
    eventSource: 'aws:dynamodb'
    awsRegion: string
    eventSourceARN: string
    dynamodb: DynamoDBStreamChangeRecord
    userIdentity?: UserIdentity | null | undefined
}

export const DynamoDBStreamRecord = {
    validate: DynamoDBStreamRecordValidator as ValidateFunction<DynamoDBStreamRecord>,
    get schema() {
        return DynamoDBStreamRecord.validate.schema
    },
    get errors() {
        return DynamoDBStreamRecord.validate.errors ?? undefined
    },
    is: (o: unknown): o is DynamoDBStreamRecord => DynamoDBStreamRecord.validate(o) === true,
    parse: (o: unknown): { right: DynamoDBStreamRecord } | { left: DefinedError[] } => {
        if (DynamoDBStreamRecord.is(o)) {
            return { right: o }
        }
        return { left: (DynamoDBStreamRecord.errors ?? []) as DefinedError[] }
    },
} as const

export interface DynamoDBStreamSchema {
    Records: DynamoDBStreamRecord[]
}

export const DynamoDBStreamSchema = {
    validate: DynamoDBStreamSchemaValidator as ValidateFunction<DynamoDBStreamSchema>,
    get schema() {
        return DynamoDBStreamSchema.validate.schema
    },
    get errors() {
        return DynamoDBStreamSchema.validate.errors ?? undefined
    },
    is: (o: unknown): o is DynamoDBStreamSchema => DynamoDBStreamSchema.validate(o) === true,
    parse: (o: unknown): { right: DynamoDBStreamSchema } | { left: DefinedError[] } => {
        if (DynamoDBStreamSchema.is(o)) {
            return { right: o }
        }
        return { left: (DynamoDBStreamSchema.errors ?? []) as DefinedError[] }
    },
} as const

export type UserIdentity =
    | {
          type: 'Service'
          principalId: 'dynamodb.amazonaws.com'
      }
    | undefined
