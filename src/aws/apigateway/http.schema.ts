import {
    APIGatewayProxyEventV2Schema as AwsAPIGatewayProxyEventV2Schema,
    APIGatewayRequestAuthorizerEventV2Schema as AwsAPIGatewayRequestAuthorizerEventV2Schema,
} from '@aws-lambda-powertools/parser/schemas'
import { $ref } from '@skyleague/therefore'

export const APIGatewayProxyEventV2Schema = $ref(AwsAPIGatewayProxyEventV2Schema)
export const APIGatewayEventRequestContextV2 = APIGatewayProxyEventV2Schema.shape.requestContext
export const RequestContextV2Http = APIGatewayEventRequestContextV2.shape.http
export const RequestContextV2Authorizer = APIGatewayEventRequestContextV2.shape.authorizer

export const APIGatewayRequestAuthorizerEventV2Schema = $ref(AwsAPIGatewayRequestAuthorizerEventV2Schema)
