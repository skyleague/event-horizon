/**
 * Generated by @skyleague/therefore@v1.0.0-local
 * Do not manually touch this
 */
/* eslint-disable */

import type { DefinedError, ValidateFunction } from 'ajv'

import { validate as SesRecordSchemaValidator } from './schemas/ses-record-schema.schema.js'
import { validate as SesSchemaValidator } from './schemas/ses-schema.schema.js'

export interface SesMail {
    timestamp: string
    source: string
    messageId: string
    destination: string[]
    headersTruncated: boolean
    headers: {
        name: string
        value: string
    }[]
    commonHeaders: {
        from: string[]
        to: string[]
        cc?: string[] | undefined
        bcc?: string[] | undefined
        sender?: string[] | undefined
        'reply-to'?: string[] | undefined
        returnPath: string
        messageId: string
        date: string
        subject: string
    }
}

export interface SesMessage {
    mail: SesMail
    receipt: SesReceipt
}

export interface SesReceipt {
    timestamp: string
    processingTimeMillis: number
    recipients: string[]
    spamVerdict: SesReceiptVerdict
    virusVerdict: SesReceiptVerdict
    spfVerdict: SesReceiptVerdict
    dmarcVerdict: SesReceiptVerdict
    dkimVerdict: SesReceiptVerdict
    dmarcPolicy: 'none' | 'quarantine' | 'reject'
    action: {
        type: 'Lambda'
        invocationType: 'Event'
        functionArn: string
    }
}

export interface SesReceiptVerdict {
    status: 'PASS' | 'FAIL' | 'GRAY' | 'PROCESSING_FAILED'
}

export interface SesRecordSchema {
    eventSource: 'aws:ses'
    eventVersion: string
    ses: SesMessage
}

export const SesRecordSchema = {
    validate: SesRecordSchemaValidator as ValidateFunction<SesRecordSchema>,
    get schema() {
        return SesRecordSchema.validate.schema
    },
    get errors() {
        return SesRecordSchema.validate.errors ?? undefined
    },
    is: (o: unknown): o is SesRecordSchema => SesRecordSchema.validate(o) === true,
    parse: (o: unknown): { right: SesRecordSchema } | { left: DefinedError[] } => {
        if (SesRecordSchema.is(o)) {
            return { right: o }
        }
        return { left: (SesRecordSchema.errors ?? []) as DefinedError[] }
    },
} as const

export interface SesSchema {
    Records: SesRecordSchema[]
}

export const SesSchema = {
    validate: SesSchemaValidator as ValidateFunction<SesSchema>,
    get schema() {
        return SesSchema.validate.schema
    },
    get errors() {
        return SesSchema.validate.errors ?? undefined
    },
    is: (o: unknown): o is SesSchema => SesSchema.validate(o) === true,
    parse: (o: unknown): { right: SesSchema } | { left: DefinedError[] } => {
        if (SesSchema.is(o)) {
            return { right: o }
        }
        return { left: (SesSchema.errors ?? []) as DefinedError[] }
    },
} as const