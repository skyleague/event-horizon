import type { LambdaHandler } from './aws.js'
import { eventHandler, EventHandlerOptions } from './event.js'
import type { EventHandler } from './types.js'

import { constants } from '../constants.js'
import type {
    EventBridgeHandler,
    FirehoseTransformationHandler,
    GatewayVersion,
    HTTPHandler,
    KinesisHandler,
    RawHandler,
    S3BatchHandler,
    S3Handler,
    SecretRotationHandler,
    SecretRotationServices,
    SNSHandler,
    SQSHandler,
} from '../events/index.js'

import type { UndefinedFields } from '@skyleague/axioms'
import type { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda'

export function firehoseHandler<Configuration, Service, Profile, Payload, Result, D>(
    definition: D & FirehoseTransformationHandler<Configuration, Service, Profile, Payload, Result>, options: EventHandlerOptions = {}
): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler, options) as D & LambdaHandler
}

export function eventBridgeHandler<Configuration, Service, Profile, Payload, Result, D>(
    definition: D & EventBridgeHandler<Configuration, Service, Profile, Payload, Result>, options: EventHandlerOptions = {}
): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler, options) as D & LambdaHandler
}

export function httpHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, GV extends GatewayVersion, D>(
    definition: D & HTTPHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, GV>, options: EventHandlerOptions = {}
): D & LambdaHandler {
    function findHeader(name: string) {
        return (request: UndefinedFields<Pick<APIGatewayProxyEvent | APIGatewayProxyEventV2, 'headers'>>) =>
            Object.entries(request.headers ?? {}).find(([n]) => n.toLowerCase() === name.toLowerCase())?.[1]
    }
    return eventHandler(definition as unknown as EventHandler, {
        ...options,
        requestId: findHeader(constants.requestIdHeader),
        traceId: findHeader(constants.traceIdHeader),
    }) as D & LambdaHandler
}

export function kinesisHandler<Configuration, Service, Profile, Payload, D>(
    definition: D & KinesisHandler<Configuration, Service, Profile, Payload>, options: EventHandlerOptions = {}
): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler, options) as D & LambdaHandler
}

export function rawHandler<Configuration, Service, Profile, Payload, Result, D>(
    definition: D & RawHandler<Configuration, Service, Profile, Payload, Result>, options: EventHandlerOptions = {}
): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler, options) as D & LambdaHandler
}

export function snsHandler<Configuration, Service, Profile, Payload, D>(
    definition: D & SNSHandler<Configuration, Service, Profile, Payload>, options: EventHandlerOptions = {}
): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler, options) as D & LambdaHandler
}

export function secretRotationHandler<Configuration extends {}, Service extends SecretRotationServices, Profile, D>(
    definition: D & SecretRotationHandler<Configuration, Service, Profile>, options: EventHandlerOptions = {}
): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler, options) as D & LambdaHandler
}

export function sqsHandler<Configuration, Service, Profile, Payload, D>(
    definition: D & SQSHandler<Configuration, Service, Profile, Payload>, options: EventHandlerOptions = {}
): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler, options) as D & LambdaHandler
}

export function s3BatchHandler<Configuration, Service, Profile, Result, D>(
    definition: D & S3BatchHandler<Configuration, Service, Profile, Result>, options: EventHandlerOptions = {}
): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler, options) as D & LambdaHandler
}

export function s3Handler<Configuration, Service, Profile, D>(
    definition: D & S3Handler<Configuration, Service, Profile>, options: EventHandlerOptions = {}
): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler, options) as D & LambdaHandler
}
