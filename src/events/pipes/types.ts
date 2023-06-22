import type { EventHandlerDefinition, LambdaContext } from '../types.js'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
export interface PipesEvent<Payload = unknown> {
    payload: Payload
    raw: unknown
}

export interface PipesEventHandler<Configuration = never, Service = never, Profile = never, Payload = unknown, Result = {}> {
    schema: {
        payload?: Schema<Payload>
        result?: Schema<Result>
    }
    handler: (payload: Payload, context: LambdaContext<Configuration, Service, Profile>) => Promisable<Try<Result>>
    payloadType?: 'json' | 'plaintext'
}

export interface PipesHandler<Configuration = never, Service = never, Profile = never, Payload = unknown, Result = {}>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    pipe: PipesEventHandler<Configuration, Service, Profile, Payload, Result>
}
