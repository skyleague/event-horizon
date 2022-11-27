import type { Config, EventHandlerDefinition, LambdaContext, Services } from '../types'

import type { Promisable, Try } from '@skyleague/axioms'
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

export interface FirehoseTransformationEventHandler<C = never, S = never, P = unknown, R = unknown> {
    schema: {
        payload?: Schema<P>
        result?: Schema<R>
    }
    handler: (
        request: FirehoseTransformationEvent<P>,
        context: LambdaContext<C, S>
    ) => Promisable<Try<FirehoseTransformationResult<R>>>
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface FirehoseTransformationHandler<C = never, S = never, P = unknown, R = unknown> extends EventHandlerDefinition {
    config?: Config<C>
    services?: Services<C, S>
    firehose: FirehoseTransformationEventHandler<C, S, P, R>
}
