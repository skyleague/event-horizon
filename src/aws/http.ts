import type {
    APIGatewayProxyEventV2Schema as AwsAPIGatewayProxyEventV2Schema,
    APIGatewayRequestAuthorizerEventV2Schema as AwsAPIGatewayRequestAuthorizerEventV2Schema,
} from '@aws-lambda-powertools/parser/schemas'
import type z from 'zod'

export type APIGatewayRequestAuthorizerEventV2Schema = z.infer<typeof AwsAPIGatewayRequestAuthorizerEventV2Schema>

export type RequestContextV2Authorizer = z.infer<
    typeof AwsAPIGatewayRequestAuthorizerEventV2Schema.shape.requestContext.shape.authorizer
>

export type APIGatewayProxyEventV2Schema = z.infer<typeof AwsAPIGatewayProxyEventV2Schema>
