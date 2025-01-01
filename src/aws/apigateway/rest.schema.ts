import {
    APIGatewayProxyEventSchema as AwsAPIGatewayProxyEventSchema,
    APIGatewayRequestAuthorizerEventSchema as AwsAPIGatewayRequestAuthorizerEventSchema,
    APIGatewayTokenAuthorizerEventSchema as AwsAPIGatewayTokenAuthorizerEventSchema,
} from '@aws-lambda-powertools/parser/schemas'
import { $ref } from '@skyleague/therefore'

export const APIGatewayProxyEventSchema = $ref(AwsAPIGatewayProxyEventSchema)
export const APIGatewayEventRequestContext = APIGatewayProxyEventSchema.shape.requestContext
export const APIGatewayEventRequestAuthorizer = APIGatewayProxyEventSchema.shape.requestContext.shape.authorizer
export const APIGatewayEventIdentity = APIGatewayEventRequestContext.shape.identity
export const APIGatewayCert = APIGatewayEventIdentity.shape.clientCert.unwrap().unwrap()

export const APIGatewayRequestAuthorizerEventSchema = $ref(AwsAPIGatewayRequestAuthorizerEventSchema)
export const APIGatewayTokenAuthorizerEventSchema = $ref(AwsAPIGatewayTokenAuthorizerEventSchema)
