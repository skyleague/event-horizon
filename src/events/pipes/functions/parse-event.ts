import { parseJSON } from '../../../parsers/index.js'
import type { PipesEventHandler } from '../types.js'

export function pipeParseEvent({ payloadType = 'json' }: PipesEventHandler) {
    return {
        before: (event: unknown) => {
            let payload: unknown = event
            if (payloadType !== 'plaintext') {
                payload = payloadType === 'json' && typeof event === 'string' ? parseJSON(event) : payload
            }
            return {
                payload: payload,
                raw: event,
            }
        },
    }
}
