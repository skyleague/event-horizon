import type { Try } from '@skyleague/axioms'
import type { Promisable } from '@skyleague/axioms/types'
import type { APIGatewayRequestAuthorizerEventV2Schema } from '../../../aws/http.js'
import type { APIGatewayRequestAuthorizerEventSchema } from '../../../aws/rest.js'
import type { InferFromParser, MaybeGenericParser } from '../../../parsers/types.js'
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

export type AuthorizerReponse<Context = undefined> = [Context] extends [undefined]
    ? { isAuthorized: boolean; context?: unknown }
    : { isAuthorized: boolean; context: Context }

export interface RequestAuthorizerEvent<
    Path = undefined,
    Query = undefined,
    Headers = undefined,
    Security extends SecuritySchemes | undefined = SecuritySchemes | undefined,
    GV extends GatewayVersion = 'http' | 'rest',
> {
    headers: [Headers] extends [undefined] ? HTTPHeaders : Headers
    query: [Query] extends [undefined] ? HTTPQueryParameters : Query
    path: [Path] extends [undefined] ? HTTPPathParameters : Path
    security: [Security] extends [undefined] ? [] : Security
    readonly raw: GV extends 'http' ? APIGatewayRequestAuthorizerEventV2Schema : APIGatewayRequestAuthorizerEventSchema
}

export interface RequestAuthorizerEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = undefined,
    Path extends MaybeGenericParser = undefined,
    Query extends MaybeGenericParser = undefined,
    Headers extends MaybeGenericParser = undefined,
    Context extends MaybeGenericParser = undefined,
    Security extends SecuritySchemes | undefined = undefined,
    GV extends GatewayVersion = 'http' | 'rest',
> {
    schema?: {
        path?: Path
        query?: Query
        headers?: Headers
        context?: Context
    }
    security?: Security
    handler: (
        request: NoInfer<
            RequestAuthorizerEvent<
                InferFromParser<Path, undefined>,
                InferFromParser<Query, undefined>,
                InferFromParser<Headers, undefined>,
                Security,
                GV
            >
        >,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<AuthorizerReponse<NoInfer<InferFromParser<Context, undefined>>>>>
}

export interface RequestAuthorizerHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = undefined,
    Path extends MaybeGenericParser = undefined,
    Query extends MaybeGenericParser = undefined,
    Headers extends MaybeGenericParser = undefined,
    Context extends MaybeGenericParser = undefined,
    Security extends SecuritySchemes | undefined = undefined,
    GV extends GatewayVersion = 'http' | 'rest',
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    request: RequestAuthorizerEventHandler<Configuration, Service, Profile, Path, Query, Headers, Context, Security, GV>
}
