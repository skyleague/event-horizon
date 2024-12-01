import { eventConstants } from '../../../constants.js'
import { EventError } from '../../../errors/event-error/event-error.js'
import type { MaybeGenericParser } from '../../../parsers/types.js'
import { type EventHandlerFn, eventHandler } from '../../common/event.js'
import type { DefaultServices } from '../../types.js'
import { findHeader } from '../event/http.js'
import { handleAuthorizerEvent } from './handler.js'
import type { RequestAuthorizerHandler, SecuritySchemes } from './types.js'

export function httpApiAuthorizer<
    D,
    Configuration = undefined,
    Service extends DefaultServices | undefined = undefined,
    Profile extends MaybeGenericParser = undefined,
    Path extends MaybeGenericParser = undefined,
    Query extends MaybeGenericParser = undefined,
    Headers extends MaybeGenericParser = undefined,
    Context extends MaybeGenericParser = undefined,
    const Security extends SecuritySchemes | undefined = undefined,
>(
    definition: D & RequestAuthorizerHandler<Configuration, Service, Profile, Path, Query, Headers, Context, Security, 'http'>,
    { _kernel = handleAuthorizerEvent }: { _kernel?: typeof handleAuthorizerEvent } = {},
): D & EventHandlerFn<Configuration, Service, Profile> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'headers' in request && 'type' in request) {
                return _kernel(definition as RequestAuthorizerHandler, request, context)
            }
            throw EventError.unexpectedEventType()
        },
        requestId: findHeader(eventConstants.requestIdHeader),
        traceId: findHeader(eventConstants.traceIdHeader),
    }) as D & EventHandlerFn<Configuration, Service, Profile>
}

export function restApiAuthorizer<
    D,
    Configuration = undefined,
    Service extends DefaultServices | undefined = undefined,
    Profile extends MaybeGenericParser = undefined,
    Path extends MaybeGenericParser = undefined,
    Query extends MaybeGenericParser = undefined,
    Headers extends MaybeGenericParser = undefined,
    Context extends MaybeGenericParser = undefined,
    const Security extends SecuritySchemes | undefined = undefined,
>(
    definition: D & RequestAuthorizerHandler<Configuration, Service, Profile, Path, Query, Headers, Context, Security, 'rest'>,
    { _kernel = handleAuthorizerEvent }: { _kernel?: typeof handleAuthorizerEvent } = {},
): D & EventHandlerFn<Configuration, Service, Profile> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'headers' in request && 'type' in request) {
                return _kernel(definition as RequestAuthorizerHandler, request, context)
            }
            throw EventError.unexpectedEventType()
        },
        requestId: findHeader(eventConstants.requestIdHeader),
        traceId: findHeader(eventConstants.traceIdHeader),
    }) as D & EventHandlerFn<Configuration, Service, Profile>
}
