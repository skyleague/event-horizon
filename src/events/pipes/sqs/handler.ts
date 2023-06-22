import type { PipesSQSHandler } from './types.js'

import type { LambdaContext } from '../../types.js'

import type { Try } from '@skyleague/axioms'
import type { SQSRecord } from 'aws-lambda'

// eslint-disable-next-line @typescript-eslint/require-await
export async function handlePipesSQS(
    handler: PipesSQSHandler,
    _events: SQSRecord[],
    _context: LambdaContext
): Promise<Try<unknown[]>> {
    const { sqs: _sqs } = handler

    return []
}
