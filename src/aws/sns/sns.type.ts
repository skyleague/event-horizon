/**
 * Generated by @skyleague/therefore@v1.0.0-local
 * Do not manually touch this
 */
/* eslint-disable */

import type { DefinedError, ValidateFunction } from 'ajv'

import { validate as SnsNotificationSchemaValidator } from './schemas/sns-notification-schema.schema.js'
import { validate as SnsRecordSchemaValidator } from './schemas/sns-record-schema.schema.js'
import { validate as SnsSchemaValidator } from './schemas/sns-schema.schema.js'

export interface SnsMsgAttribute {
    Type: string
    Value: string
}

export interface SnsNotificationSchema {
    Subject?: string | null | undefined
    TopicArn: string
    UnsubscribeUrl: string
    UnsubscribeURL?: string | undefined
    SigningCertUrl?: string | undefined
    SigningCertURL?: string | undefined
    Type: 'Notification'
    MessageAttributes?:
        | {
              [k: string]: SnsMsgAttribute | undefined
          }
        | undefined
    Message: string
    MessageId: string
    Signature?: string | undefined
    SignatureVersion?: string | undefined
    Timestamp: string
}

export const SnsNotificationSchema = {
    validate: SnsNotificationSchemaValidator as ValidateFunction<SnsNotificationSchema>,
    get schema() {
        return SnsNotificationSchema.validate.schema
    },
    get errors() {
        return SnsNotificationSchema.validate.errors ?? undefined
    },
    is: (o: unknown): o is SnsNotificationSchema => SnsNotificationSchema.validate(o) === true,
    parse: (o: unknown): { right: SnsNotificationSchema } | { left: DefinedError[] } => {
        if (SnsNotificationSchema.is(o)) {
            return { right: o }
        }
        return { left: (SnsNotificationSchema.errors ?? []) as DefinedError[] }
    },
} as const

export interface SnsRecordSchema {
    EventSource: 'aws:sns'
    EventVersion: string
    EventSubscriptionArn: string
    Sns: SnsNotificationSchema
}

export const SnsRecordSchema = {
    validate: SnsRecordSchemaValidator as ValidateFunction<SnsRecordSchema>,
    get schema() {
        return SnsRecordSchema.validate.schema
    },
    get errors() {
        return SnsRecordSchema.validate.errors ?? undefined
    },
    is: (o: unknown): o is SnsRecordSchema => SnsRecordSchema.validate(o) === true,
    parse: (o: unknown): { right: SnsRecordSchema } | { left: DefinedError[] } => {
        if (SnsRecordSchema.is(o)) {
            return { right: o }
        }
        return { left: (SnsRecordSchema.errors ?? []) as DefinedError[] }
    },
} as const

export interface SnsSchema {
    Records: SnsRecordSchema[]
}

export const SnsSchema = {
    validate: SnsSchemaValidator as ValidateFunction<SnsSchema>,
    get schema() {
        return SnsSchema.validate.schema
    },
    get errors() {
        return SnsSchema.validate.errors ?? undefined
    },
    is: (o: unknown): o is SnsSchema => SnsSchema.validate(o) === true,
    parse: (o: unknown): { right: SnsSchema } | { left: DefinedError[] } => {
        if (SnsSchema.is(o)) {
            return { right: o }
        }
        return { left: (SnsSchema.errors ?? []) as DefinedError[] }
    },
} as const