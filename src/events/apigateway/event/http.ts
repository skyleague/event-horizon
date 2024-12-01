import { eventConstants } from '../../../constants.js'
import { EventError } from '../../../errors/event-error/event-error.js'
import type { MaybeGenericParser } from '../../../parsers/types.js'
import type { EventHandlerFn } from '../../common/event.js'
import { eventHandler } from '../../common/event.js'
import type { RawRequest } from '../../common/raw-aws.js'
import type { DefaultServices } from '../../types.js'
import type { SecurityRequirements } from '../types.js'
import { handleHTTPEvent } from './handler.js'
import type { AuthorizerSchema, HTTPHandler, Responses } from './types.js'

export function findHeader(name: string) {
    return (request: RawRequest) =>
        Object.entries(
            typeof request === 'object' && request !== null && 'headers' in request ? (request.headers ?? {}) : {},
        ).find(([n]) => n.toLowerCase() === name.toLowerCase())?.[1]
}

export function restApiHandler<
    D,
    Configuration = undefined,
    Service extends DefaultServices | undefined = undefined,
    Profile extends MaybeGenericParser = undefined,
    Body extends MaybeGenericParser = undefined,
    Path extends MaybeGenericParser = undefined,
    Query extends MaybeGenericParser = undefined,
    Headers extends MaybeGenericParser = undefined,
    const Result extends Responses = Responses,
    const Security extends SecurityRequirements | undefined = undefined,
    Authorizer extends AuthorizerSchema<'rest'> = AuthorizerSchema<'rest'>,
>(
    definition: D &
        HTTPHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, Security, 'rest', Authorizer>,
    {
        _kernel = handleHTTPEvent,
    }: {
        _kernel?: typeof handleHTTPEvent
    } = {},
): D & EventHandlerFn<Configuration, Service, Profile, Result> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'headers' in request && !('type' in request)) {
                return _kernel(definition as HTTPHandler, request, context)
            }
            throw EventError.unexpectedEventType()
        },
        requestId: findHeader(eventConstants.requestIdHeader),
        traceId: findHeader(eventConstants.traceIdHeader),
    }) as D & EventHandlerFn<Configuration, Service, Profile, Result>
}

export function httpApiHandler<
    D,
    Configuration = undefined,
    Service extends DefaultServices | undefined = undefined,
    Profile extends MaybeGenericParser = undefined,
    Body extends MaybeGenericParser = undefined,
    Path extends MaybeGenericParser = undefined,
    Query extends MaybeGenericParser = undefined,
    Headers extends MaybeGenericParser = undefined,
    const Result extends Responses = Responses,
    const Security extends SecurityRequirements | undefined = undefined,
    Authorizer extends AuthorizerSchema<'http'> = AuthorizerSchema<'http'>,
>(
    definition: D &
        HTTPHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, Security, 'http', Authorizer>,
    { _kernel = handleHTTPEvent }: { _kernel?: typeof handleHTTPEvent } = {},
): D & EventHandlerFn<Configuration, Service, Profile, Result> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'headers' in request && !('type' in request)) {
                return _kernel(definition as HTTPHandler, request, context)
            }
            throw EventError.unexpectedEventType()
        },
        requestId: findHeader(eventConstants.requestIdHeader),
        traceId: findHeader(eventConstants.traceIdHeader),
    }) as D & EventHandlerFn<Configuration, Service, Profile, Result>
}
