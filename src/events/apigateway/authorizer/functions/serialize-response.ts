import type {
    APIGatewayAuthorizerResultContext,
    APIGatewayIAMAuthorizerResult,
    APIGatewaySimpleAuthorizerResult,
} from 'aws-lambda'
import type { APIGatewayRequestAuthorizerEventV2Schema } from '../../../../aws/apigateway/http.type.js'
import type { APIGatewayRequestAuthorizerEventSchema } from '../../../../aws/apigateway/rest.type.js'
import type { AuthorizerReponse } from '../types.js'

export function authorizerSerializeResponse() {
    return {
        onAfter: (
            event: APIGatewayRequestAuthorizerEventV2Schema | APIGatewayRequestAuthorizerEventSchema,
            response: AuthorizerReponse,
        ): APIGatewayIAMAuthorizerResult & APIGatewaySimpleAuthorizerResult => {
            // make the true version really strict
            const isAuthorized = response.isAuthorized === true
            if ('routeArn' in event) {
                // we are on the http apigateway payload
                return {
                    isAuthorized: isAuthorized,

                    // for backwards compatibility
                    principalId: event.requestContext.http.sourceIp ?? 'unknown',
                    policyDocument: {
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Action: 'execute-api:Invoke',
                                Effect: isAuthorized ? 'Allow' : 'Deny',
                                Resource: event.routeArn,
                            },
                        ],
                    },
                    context: response.context as APIGatewayAuthorizerResultContext,
                }
            }
            return {
                isAuthorized: isAuthorized,
                principalId: event.requestContext.identity.sourceIp ?? 'unknown',
                policyDocument: {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Action: 'execute-api:Invoke',
                            Effect: isAuthorized ? 'Allow' : 'Deny',
                            Resource: event.methodArn,
                        },
                    ],
                },
                context: response.context as APIGatewayAuthorizerResultContext,
            }
        },
    }
}
