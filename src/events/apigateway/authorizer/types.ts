import type { Promisable, Try } from '@skyleague/axioms'
import type { IfUnknown } from '@skyleague/axioms/types'
import type { Schema } from '@skyleague/therefore'
import type { APIGatewayRequestAuthorizerEventV2Schema } from '../../../aws/apigateway/http.type.js'
import type { APIGatewayRequestAuthorizerEventSchema } from '../../../aws/apigateway/rest.type.js'
import type { EventHandlerDefinition, LambdaContext } from '../../types.js'
import type { GatewayVersion } from '../event/types.js'
import type { HTTPHeaders, HTTPPathParameters, HTTPQueryParameters } from '../types.js'

export type SecuritySchemes = Record<string, SecurityScheme>
export type SecurityScheme = APIKeySecurityScheme | HTTPSecurityScheme
export interface APIKeySecurityScheme {
    type: 'apiKey'
    name: string
    in: 'header' | 'query'
}
export interface HTTPSecurityScheme {
    type: 'http'
    scheme: 'basic' | 'bearer'
    bearerFormat?: 'JWT'
}

export type AuthorizerReponse<Context = unknown> = { isAuthorized: boolean } & IfUnknown<
    Context,
    { context?: never },
    { context: Context }
>

export interface RequestAuthorizerEvent<
    Path = HTTPPathParameters | undefined,
    Query = HTTPQueryParameters | undefined,
    Headers = HTTPHeaders | undefined,
    Security extends SecuritySchemes = SecuritySchemes,
    GV extends GatewayVersion = 'http' | 'rest',
> {
    headers: Headers
    query: Query
    path: Path
    security: Security
    readonly raw: GV extends 'http' ? APIGatewayRequestAuthorizerEventV2Schema : APIGatewayRequestAuthorizerEventSchema
}

export interface RequestAuthorizerEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile = unknown,
    Path = HTTPPathParameters,
    Query = HTTPQueryParameters,
    Headers = HTTPHeaders,
    Context = unknown,
    Security extends SecuritySchemes = SecuritySchemes,
    GV extends GatewayVersion = 'http' | 'rest',
> {
    schema?: {
        path?: Schema<Path>
        query?: Schema<Query>
        headers?: Schema<Headers>
        context?: Schema<Context>
    }
    security?: Security
    handler: (
        request: NoInfer<RequestAuthorizerEvent<Path, Query, Headers, Security, GV>>,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<AuthorizerReponse<NoInfer<Context>>>>
}

export interface RequestAuthorizerHandler<
    Configuration = unknown,
    Service = unknown,
    Profile = unknown,
    Path = HTTPPathParameters,
    Query = HTTPQueryParameters,
    Headers = HTTPHeaders,
    Context = unknown,
    Security extends SecuritySchemes = SecuritySchemes,
    GV extends GatewayVersion = 'http' | 'rest',
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    request: RequestAuthorizerEventHandler<Configuration, Service, Profile, Path, Query, Headers, Context, Security, GV>
}
