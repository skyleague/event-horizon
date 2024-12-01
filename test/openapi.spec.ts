import { expect, it } from 'vitest'
import { handlerJson } from '../examples/pet-store/functions/openapi/handler.js'
import { handlerJson as handlerJsonZod } from '../examples/pet-zod/functions/openapi/handler.js'

it('buids the petstore openapi', () => {
    expect(handlerJson.http.handler()).toMatchSnapshot()
})

it('buids the petstore openapi - zod', () => {
    expect(handlerJsonZod.http.handler()).toMatchSnapshot()
})
