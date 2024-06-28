import { eventConstants } from '../../constants.js'
import { EventError } from '../../errors/event-error/event-error.js'
import type { EventHandlerFn } from '../common/event.js'
import { eventHandler } from '../common/event.js'
import type { RawRequest } from '../common/raw-aws.js'
import type { DefaultServices } from '../types.js'
import { handleHTTPEvent } from './handler.js'
import type { HTTPHandler } from './types.js'

function findHeader(name: string) {
    return (request: RawRequest) =>
        Object.entries(typeof request === 'object' && request !== null && 'headers' in request ? request.headers ?? {} : {}).find(
            ([n]) => n.toLowerCase() === name.toLowerCase(),
        )?.[1]
}

export function restApiHandler<
    Configuration,
    Service extends DefaultServices | undefined,
    Profile,
    Body,
    Path,
    Query,
    Headers,
    Result,
    D,
>(
    definition: D & HTTPHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, 'rest'>,
    { _kernel = handleHTTPEvent }: { _kernel?: typeof handleHTTPEvent } = {},
): D & EventHandlerFn<Configuration, Service, Profile, Result> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'headers' in request) {
                return _kernel(definition, request, context)
            }
            throw EventError.unexpectedEventType()
        },
        requestId: findHeader(eventConstants.requestIdHeader),
        traceId: findHeader(eventConstants.traceIdHeader),
    }) as D & EventHandlerFn<Configuration, Service, Profile, Result>
}

export function httpApiHandler<
    Configuration,
    Service extends DefaultServices | undefined,
    Profile,
    Body,
    Path,
    Query,
    Headers,
    Result,
    D,
>(
    definition: D & HTTPHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, 'http'>,
    { _kernel = handleHTTPEvent }: { _kernel?: typeof handleHTTPEvent } = {},
): D & EventHandlerFn<Configuration, Service, Profile, Result> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'headers' in request) {
                return _kernel(definition, request, context)
            }
            throw EventError.unexpectedEventType()
        },
        requestId: findHeader(eventConstants.requestIdHeader),
        traceId: findHeader(eventConstants.traceIdHeader),
    }) as D & EventHandlerFn<Configuration, Service, Profile, Result>
}
