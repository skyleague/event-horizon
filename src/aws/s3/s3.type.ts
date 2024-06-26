/**
 * Generated by @skyleague/therefore@v1.0.0-local
 * Do not manually touch this
 */
/* eslint-disable */

import type { DefinedError, ValidateFunction } from 'ajv'

import { validate as S3EventNotificationEventBridgeDetailSchemaValidator } from './schemas/s3-event-notification-event-bridge-detail-schema.schema.js'
import { validate as S3RecordSchemaValidator } from './schemas/s3-record-schema.schema.js'
import { validate as S3SchemaValidator } from './schemas/s3-schema.schema.js'

export interface S3EventNotificationEventBridgeDetailSchema {
    version: string
    bucket: {
        name: string
    }
    object: {
        key: string
        size?: number | undefined
        etag?: string | undefined
        'version-id'?: string | undefined
        sequencer?: string | undefined
    }
    'request-id': string
    requester: string
    'source-ip-address'?: string | undefined
    reason?: string | undefined
    'deletion-type'?: string | undefined
    'restore-expiry-time'?: string | undefined
    'source-storage-class'?: string | undefined
    'destination-storage-class'?: string | undefined
    'destination-access-tier'?: string | undefined
}

export const S3EventNotificationEventBridgeDetailSchema = {
    validate: S3EventNotificationEventBridgeDetailSchemaValidator as ValidateFunction<S3EventNotificationEventBridgeDetailSchema>,
    get schema() {
        return S3EventNotificationEventBridgeDetailSchema.validate.schema
    },
    get errors() {
        return S3EventNotificationEventBridgeDetailSchema.validate.errors ?? undefined
    },
    is: (o: unknown): o is S3EventNotificationEventBridgeDetailSchema =>
        S3EventNotificationEventBridgeDetailSchema.validate(o) === true,
    parse: (o: unknown): { right: S3EventNotificationEventBridgeDetailSchema } | { left: DefinedError[] } => {
        if (S3EventNotificationEventBridgeDetailSchema.is(o)) {
            return { right: o }
        }
        return { left: (S3EventNotificationEventBridgeDetailSchema.errors ?? []) as DefinedError[] }
    },
} as const

export interface S3EventNotificationEventBridgeSchema {
    version: string
    id: string
    source: string
    account: string
    time: string
    region: string
    resources: string[]
    'detail-type': string
    detail: S3EventNotificationEventBridgeDetailSchema
    'replay-name'?: string | undefined
}

export interface S3EventRecordGlacierEventData {
    restoreEventData: {
        lifecycleRestorationExpiryTime: string
        lifecycleRestoreStorageClass: string
    }
}

export interface S3Identity {
    principalId: string
}

export interface S3Message {
    s3SchemaVersion: string
    configurationId: string
    object: {
        key: string
        size?: number | undefined
        urlDecodedKey?: string | undefined
        eTag?: string | undefined
        sequencer: string
        versionId?: string | undefined
    }
    bucket: {
        name: string
        ownerIdentity: S3Identity
        arn: string
    }
}

export interface S3RecordSchema {
    eventVersion: string
    eventSource: 'aws:s3'
    awsRegion: string
    eventTime: string
    eventName: string
    userIdentity: S3Identity
    requestParameters: S3RequestParameters
    responseElements: S3ResponseElements
    s3: S3Message
    glacierEventData?: S3EventRecordGlacierEventData | undefined
}

export const S3RecordSchema = {
    validate: S3RecordSchemaValidator as ValidateFunction<S3RecordSchema>,
    get schema() {
        return S3RecordSchema.validate.schema
    },
    get errors() {
        return S3RecordSchema.validate.errors ?? undefined
    },
    is: (o: unknown): o is S3RecordSchema => S3RecordSchema.validate(o) === true,
    parse: (o: unknown): { right: S3RecordSchema } | { left: DefinedError[] } => {
        if (S3RecordSchema.is(o)) {
            return { right: o }
        }
        return { left: (S3RecordSchema.errors ?? []) as DefinedError[] }
    },
} as const

export interface S3RequestParameters {
    sourceIPAddress: string
}

export interface S3ResponseElements {
    'x-amz-request-id': string
    'x-amz-id-2': string
}

export interface S3Schema {
    Records: S3RecordSchema[]
}

export const S3Schema = {
    validate: S3SchemaValidator as ValidateFunction<S3Schema>,
    get schema() {
        return S3Schema.validate.schema
    },
    get errors() {
        return S3Schema.validate.errors ?? undefined
    },
    is: (o: unknown): o is S3Schema => S3Schema.validate(o) === true,
    parse: (o: unknown): { right: S3Schema } | { left: DefinedError[] } => {
        if (S3Schema.is(o)) {
            return { right: o }
        }
        return { left: (S3Schema.errors ?? []) as DefinedError[] }
    },
} as const
