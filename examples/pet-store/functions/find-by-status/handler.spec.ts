import { handler } from './handler.js'

import { httpApiEvent } from '../../../../src/dev/event-horizon/apigateway/event/http.js'
import { context } from '../../../../src/test/context/context.js'
import { PetArray } from '../../lib/models.type.js'

import { forAll, tuple } from '@skyleague/axioms'
import { it } from 'vitest'

it('handler', async () => {
    forAll(tuple(httpApiEvent(handler as any), await context()), ([x, ctx]) => {
        const { statusCode, body } = handler.http.handler(x as any, ctx)
        return statusCode === 200 && PetArray.is(body) && body.every((p) => p.status === (x.query as any).status)
    })
})
