import type { HTTPResponse } from '../types'

import { isString } from '@skyleague/axioms'
import type { APIGatewayProxyResult, APIGatewayProxyResultV2 } from 'aws-lambda'

export function httpSerializeResponse() {
    return {
        onAfter: (response: HTTPResponse): APIGatewayProxyResult | APIGatewayProxyResultV2 => {
            // if the response is JSON we add the content type to the headers
            const contentType = !isString(response.body) ? { 'Content-Type': 'application/json' } : {}

            return {
                statusCode: response.statusCode,
                headers: { ...contentType, ...response.headers },
                body: isString(response.body) ? response.body : JSON.stringify(response.body),
            }
        },
    }
}
