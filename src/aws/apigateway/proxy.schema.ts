import { APIGatewayEventRequestContextV2 } from './http.schema.js'
import { APIGatewayProxyEventSchema } from './rest.schema.js'

export const APIGatewayCert = APIGatewayEventRequestContextV2.shape.authentication.unwrap().unwrap().shape.clientCert.unwrap()
export const APIGatewayRecord = APIGatewayProxyEventSchema.shape.headers.unwrap()
export const APIGatewayHttpMethod = APIGatewayProxyEventSchema.shape.httpMethod
