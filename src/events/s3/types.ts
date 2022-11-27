import type { Config, LambdaContext, Services, EventHandlerDefinition } from '../types'

import type { Promisable, Try } from '@skyleague/axioms'
import type { S3EventRecord } from 'aws-lambda'

export interface S3Event {
    raw: S3EventRecord
}

export interface S3EventHandler<C = never, S = never> {
    handler: (request: S3Event, context: LambdaContext<C, S>) => Promisable<Try<void>>
}

export interface S3Handler<C = never, S = never> extends EventHandlerDefinition {
    config?: Config<C>
    services?: Services<C, S>
    s3: S3EventHandler<C, S>
}
