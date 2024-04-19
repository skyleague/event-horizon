import { handler } from './handler.js'

import { httpEvent } from '../../../../src/dev/event-horizon/http/http.js'
import { context } from '../../../../src/test/context/context.js'
import { Pet } from '../../lib/models.type.js'

import { forAll, tuple } from '@skyleague/axioms'
import { it } from 'vitest'

it('handler', async () => {
    forAll(tuple(httpEvent(handler as any), await context()), ([x, ctx]) => {
        const { statusCode, body } = handler.http.handler(x as any, ctx)
        return statusCode === 200 && Pet.is(body)
    })
})
