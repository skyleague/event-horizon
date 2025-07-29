import type { Context as LambdaContext } from 'aws-lambda'
import { it } from 'vitest'
import type { Context } from './context.type.js'

it('type is compatible', () => {
    const _test: Context = {} as unknown as LambdaContext
    // const _test2: LambdaContext = {} as unknown as Context
})
