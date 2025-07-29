import 'tsx'
import { expect, it } from 'vitest'
import * as handlers from '../examples/pet-store/functions/index.js'
import { openapiFromHandlers } from '../src/spec/openapi/openapi.js'

it('buids the petstore openapi', async () => {
    expect(await openapiFromHandlers(handlers, { info: { title: 'title', version: '1.0.0' } })).toMatchSnapshot()
})
