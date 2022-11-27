import type { LambdaHandler } from './aws'
import { eventHandler } from './event'
import type { EventHandler } from './types'

import { constants } from '../constants'
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
} from '../events'

import type { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda'

export function firehoseHandler<C, S, FirehoseP, FirehoseR, D>(
    definition: D & FirehoseTransformationHandler<C, S, FirehoseP, FirehoseR>
): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler) as D & LambdaHandler
}

export function eventBridgeHandler<C, S, EbP, EbR, D>(definition: D & EventBridgeHandler<C, S, EbP, EbR>): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler) as D & LambdaHandler
}

export function httpHandler<C, S, HttpB, HttpP, HttpQ, HttpH, HttpR, GV extends GatewayVersion, D>(
    definition: D & HTTPHandler<C, S, HttpB, HttpP, HttpQ, HttpH, HttpR, GV>
): D & LambdaHandler {
    function findHeader(name: string) {
        return (request: APIGatewayProxyEvent | APIGatewayProxyEventV2) =>
            Object.entries(request.headers ?? {}).find(([n]) => n.toLowerCase() === name.toLowerCase())?.[1]
    }
    return eventHandler(definition as unknown as EventHandler, {
        requestId: findHeader(constants.requestIdHeader),
        traceId: findHeader(constants.traceIdHeader),
    }) as D & LambdaHandler
}

export function kinesisHandler<C, S, KinesisP, D>(definition: D & KinesisHandler<C, S, KinesisP>): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler) as D & LambdaHandler
}

export function rawHandler<C, S, RawP, RawR, D>(definition: D & RawHandler<C, S, RawP, RawR>): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler) as D & LambdaHandler
}

export function snsHandler<C, S, SnsP, D>(definition: D & SNSHandler<C, S, SnsP>): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler) as D & LambdaHandler
}

export function secretRotationHandler<C extends {}, S extends SecretRotationServices, D>(
    definition: D & SecretRotationHandler<C, S>
): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler) as D & LambdaHandler
}

export function sqsHandler<C, S, SqsP, D>(definition: D & SQSHandler<C, S, SqsP>): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler) as D & LambdaHandler
}

export function s3BatchHandler<C, S, S3BatchR, D>(definition: D & S3BatchHandler<C, S, S3BatchR>): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler) as D & LambdaHandler
}

export function s3Handler<C, S, D>(definition: D & S3Handler<C, S>): D & LambdaHandler {
    return eventHandler(definition as unknown as EventHandler) as D & LambdaHandler
}
