import type { HttpResponse } from '../types'

import { isString } from '@skyleague/axioms'
import type { APIGatewayProxyResult, APIGatewayProxyResultV2 } from 'aws-lambda'

export function httpSerializeResponse() {
    return {
        onAfter: (response: HttpResponse): APIGatewayProxyResult | APIGatewayProxyResultV2 => {
            return {
                statusCode: response.statusCode,
                headers: response.headers,
                body: isString(response.body) ? response.body : JSON.stringify(response.body),
            }
        },
    }
}
