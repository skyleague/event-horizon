import { APIGatewayProxyEventV2Schema as AwsAPIGatewayProxyEventV2Schema } from '@aws-lambda-powertools/parser/schemas'
import { $ref } from '@skyleague/therefore'

export const APIGatewayProxyEventV2Schema = $ref(AwsAPIGatewayProxyEventV2Schema).validator()
export const APIGatewayEventRequestContextV2 = APIGatewayProxyEventV2Schema.shape.requestContext.validator()
export const RequestContextV2Http = APIGatewayEventRequestContextV2.shape.http
export const RequestContextV2Authorizer = APIGatewayEventRequestContextV2.shape.authorizer
export const APIGatewayCert = APIGatewayEventRequestContextV2.shape.authentication.shape.clientCert
