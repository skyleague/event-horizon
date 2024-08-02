import { isString } from '@skyleague/axioms'
import type { APIGatewayProxyResult, APIGatewayProxyResultV2 } from 'aws-lambda'
import type { HTTPEmptyResponse, HTTPResponse } from '../types.js'

export function httpSerializeResponse() {
    return {
        onAfter: (response: HTTPResponse | HTTPEmptyResponse): APIGatewayProxyResult | APIGatewayProxyResultV2 => {
            // if the response is JSON we add the content type to the headers
            const contentType = !isString(response.body) ? { 'Content-Type': 'application/json' } : {}

            return {
                statusCode: response.statusCode,
                headers: { ...contentType, ...response.headers },
                body: isString(response.body) ? response.body : response.body !== undefined ? JSON.stringify(response.body) : '',
            }
        },
    }
}
