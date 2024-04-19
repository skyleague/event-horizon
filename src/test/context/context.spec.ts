import { context } from './context.js'

import { Context } from '../../dev/aws/lambda/context.type.js'

import { forAll } from '@skyleague/axioms'
import { it } from 'vitest'

it('context === context', async () => {
    forAll(await context(), (c) => Context.is(c.raw))
})
