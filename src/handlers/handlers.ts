import type { AWSLambdaHandler } from './aws'
import { eventHandler } from './event'
import type { EventHandler } from './types'

import type {
    GatewayVersion,
    HttpHandler,
    KinesisHandler,
    RawHandler,
    SnsHandler,
    SecretRotationServices,
    SecretRotationHandler,
    FirehoseTransformationHandler,
    EventBridgeHandler,
    SQSHandler,
    S3BatchHandler,
} from '../events'

export function firehoseHandler<C, S, FirehoseP, FirehoseR, D>(
    definition: D & FirehoseTransformationHandler<C, S, FirehoseP, FirehoseR>
): AWSLambdaHandler & D {
    return eventHandler(definition as unknown as EventHandler) as AWSLambdaHandler & D
}

export function eventBridgeHandler<C, S, EbP, EbR, D>(definition: D & EventBridgeHandler<C, S, EbP, EbR>): AWSLambdaHandler & D {
    return eventHandler(definition as unknown as EventHandler) as AWSLambdaHandler & D
}

export function httpHandler<C, S, HttpB, HttpP, HttpQ, HttpH, HttpR, GV extends GatewayVersion, D>(
    definition: D & HttpHandler<C, S, HttpB, HttpP, HttpQ, HttpH, HttpR, GV>
): AWSLambdaHandler & D {
    return eventHandler(definition as unknown as EventHandler) as AWSLambdaHandler & D
}

export function kinesisHandler<C, S, KinesisP, KinesisR, D>(
    definition: D & KinesisHandler<C, S, KinesisP, KinesisR>
): AWSLambdaHandler & D {
    return eventHandler(definition as unknown as EventHandler) as AWSLambdaHandler & D
}

export function rawHandler<C, S, RawP, RawR, D>(definition: D & RawHandler<C, S, RawP, RawR>): AWSLambdaHandler & D {
    return eventHandler(definition as unknown as EventHandler) as AWSLambdaHandler & D
}

export function snsHandler<C, S, SnsP, D>(definition: D & SnsHandler<C, S, SnsP>): AWSLambdaHandler & D {
    return eventHandler(definition as unknown as EventHandler) as AWSLambdaHandler & D
}

export function secretRotationHandler<C extends {}, S extends SecretRotationServices, D>(
    definition: D & SecretRotationHandler<C, S>
): AWSLambdaHandler & D {
    return eventHandler(definition as unknown as EventHandler) as AWSLambdaHandler & D
}

export function sqsHandler<C, S, SqsP, D>(definition: D & SQSHandler<C, S, SqsP>): AWSLambdaHandler & D {
    return eventHandler(definition as unknown as EventHandler) as AWSLambdaHandler & D
}

export function s3BatchHandler<C, S, S3BatchR, D>(definition: D & S3BatchHandler<C, S, S3BatchR>): AWSLambdaHandler & D {
    return eventHandler(definition as unknown as EventHandler) as AWSLambdaHandler & D
}
