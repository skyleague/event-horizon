import type { Simplify } from '@skyleague/axioms/types'
import type { Schema } from '@skyleague/therefore'
import type { Equal, Expect } from 'type-testing'
import { it } from 'vitest'
import type { HTTPHeaders } from '../types.js'
import type { HTTPResponses } from './types.js'

it('response type is properly expanded', () => {
    type _test_simple_response = Expect<
        Equal<
            Simplify<HTTPResponses<{ 200: Schema<'200-response'> }>>,
            {
                statusCode: 200
                headers?: HTTPHeaders | undefined
                body: '200-response'
            }
        >
    >
    type _test_null_response = Expect<
        Equal<
            Simplify<HTTPResponses<{ 200: null }>>,
            {
                statusCode: 200
                headers?: HTTPHeaders | undefined
                body?: never
            }
        >
    >

    type _test_full_response = Expect<
        Equal<
            Simplify<HTTPResponses<{ 200: { body: Schema<'200-response'> } }>>,
            {
                statusCode: 200
                headers?: HTTPHeaders | undefined
                body: '200-response'
            }
        >
    >

    type _test_overloaded_response = Expect<
        Equal<
            Simplify<HTTPResponses<{ 200: Schema<'200-response'>; 204: Schema<'204-response'> }>>,
            | {
                  statusCode: 200
                  headers?: HTTPHeaders | undefined
                  body: '200-response'
              }
            | {
                  statusCode: 204
                  headers?: HTTPHeaders | undefined
                  body: '204-response'
              }
        >
    >

    type _test_mixed_overloaded_response = Expect<
        Equal<
            Simplify<HTTPResponses<{ 200: Schema<'200-response'>; 204: { body: Schema<'204-response'> } }>>,
            | {
                  statusCode: 200
                  headers?: HTTPHeaders | undefined
                  body: '200-response'
              }
            | {
                  statusCode: 204
                  headers?: HTTPHeaders | undefined
                  body: '204-response'
              }
        >
    >

    type _test_mixed_overloaded_response_2 = Expect<
        Equal<
            Simplify<HTTPResponses<{ 200: { body: Schema<'200-response'> }; 400: Schema<'400-response'> }>>,
            | {
                  statusCode: 400
                  headers?: HTTPHeaders | undefined
                  body: '400-response'
              }
            | {
                  statusCode: 200
                  headers?: HTTPHeaders | undefined
                  body: '200-response'
              }
        >
    >
    type _test_mixed_overloaded_repsponse_headers = Expect<
        Equal<
            Simplify<
                HTTPResponses<{
                    200: { body: Schema<'200-response'>; headers: Schema<{ foo: 'bar' }> }
                    400: Schema<'400-response'>
                }>
            >,
            | {
                  statusCode: 400
                  headers?: HTTPHeaders
                  body: '400-response'
              }
            | {
                  statusCode: 200
                  headers: {
                      foo: 'bar'
                  }
                  body: '200-response'
              }
        >
    >
})
