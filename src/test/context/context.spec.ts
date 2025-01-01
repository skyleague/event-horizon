import { forAll } from '@skyleague/axioms'
import { it } from 'vitest'
import { context as contextSchema } from '../../aws/lambda/context.schema.js'
import { context } from './context.js'

it('context === context', async () => {
    forAll(await context(), (c) => {
        contextSchema.parse(c.raw)
    })
})
