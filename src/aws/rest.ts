import type {
    APIGatewayProxyEventSchema as AwsAPIGatewayProxyEventSchema,
    APIGatewayRequestAuthorizerEventSchema as AwsAPIGatewayRequestAuthorizerEventSchema,
} from '@aws-lambda-powertools/parser/schemas'
import type z from 'zod'

export type APIGatewayRequestAuthorizerEventSchema = z.infer<typeof AwsAPIGatewayRequestAuthorizerEventSchema>

export type APIGatewayProxyEventSchema = z.infer<typeof AwsAPIGatewayProxyEventSchema>

export type APIGatewayEventRequestContext = z.infer<typeof AwsAPIGatewayProxyEventSchema.shape.requestContext>
