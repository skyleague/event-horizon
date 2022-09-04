import type { TokenAuthorizerRequest } from '../../events/authorizer/types'

import type { APIGatewayTokenAuthorizerEvent } from 'aws-lambda'

export function tokenAuthorizerParseEvent() {
    return {
        before: (event: APIGatewayTokenAuthorizerEvent): TokenAuthorizerRequest => {
            return {
                authorizationToken: event.authorizationToken,
                methodArn: event.methodArn,
                raw: event,
            }
        },
    }
}
