import type { HttpResponse } from '../../events/http/types'

import type { APIGatewayProxyResult, APIGatewayProxyResultV2 } from 'aws-lambda'

export function httpSerializeResponse() {
    return {
        onAfter: (response: HttpResponse): APIGatewayProxyResult | APIGatewayProxyResultV2 => {
            return {
                statusCode: response.statusCode,
                headers: response.headers,
                body: JSON.stringify(response.body),
            }
        },
    }
}
