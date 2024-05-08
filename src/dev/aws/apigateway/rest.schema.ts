import { APIGatewayProxyEventSchema as AwsAPIGatewayProxyEventSchema } from '@aws-lambda-powertools/parser/schemas'
import { $ref } from '@skyleague/therefore'

export const APIGatewayProxyEventSchema = $ref(AwsAPIGatewayProxyEventSchema).validator()
export const APIGatewayEventRequestContext = APIGatewayProxyEventSchema.shape.requestContext.validator()
export const APIGatewayEventIdentity = APIGatewayEventRequestContext.shape.identity
export const APIGatewayCert = APIGatewayEventIdentity.shape.clientCert
