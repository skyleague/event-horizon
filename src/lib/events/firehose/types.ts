import type { HandlerDefinition } from '../../types'
import type { LambdaContext } from '../context'

import type { Schema } from '@skyleague/therefore'
import type { FirehoseRecordTransformationStatus, FirehoseTransformationEventRecord } from 'aws-lambda'

export interface FirehoseTransformationResult<R = unknown> {
    status: FirehoseRecordTransformationStatus
    payload: R
}

export interface FirehoseTransformationEvent<P = unknown> {
    payload: P
    raw: FirehoseTransformationEventRecord
}

export interface FirehoseTransformationEventHandler<C = unknown, S = unknown, P = unknown, R = unknown> {
    schema: {
        payload?: Schema<P>
        result?: Schema<R>
    }
    handler: (
        request: P,
        context: LambdaContext<C, S>
    ) => FirehoseTransformationResult<R> | Promise<FirehoseTransformationResult<R>>
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface FirehoseTransformationHandler<C = unknown, S = unknown, P = unknown, R = unknown> extends HandlerDefinition {
    config?: C
    services?: S // Services<C, S>
    firehose: FirehoseTransformationEventHandler<C, S, P, R>
}
