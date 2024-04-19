import { handler } from './handler.js'

import { httpEvent } from '../../../../src/dev/event-horizon/http/http.js'
import { context } from '../../../../src/dev/test/context/context.js'
import { PetArray } from '../../lib/models.type.js'

import { forAll, tuple } from '@skyleague/axioms'
import { it } from 'vitest'

it('handler', async () => {
    forAll(tuple(httpEvent(handler as any), await context()), ([x, ctx]) => {
        const { statusCode, body } = handler.http.handler(x as any, ctx)
        return statusCode === 200 && PetArray.is(body) && body.every((p) => p.status === (x.query as any).status)
    })
})
