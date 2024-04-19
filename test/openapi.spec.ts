import { expect, it } from 'vitest'
import { handlerJson } from '../examples/pet-store/functions/openapi/handler.js'

it('buids the petstore openapi', () => {
    expect(handlerJson.http.handler()).toMatchSnapshot()
})
