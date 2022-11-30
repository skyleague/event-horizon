import type { EventHandlerDefinition, LambdaContext } from '../types'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'

export interface RawEventHandler<Configuration = never, Service = never, Profile = never, Payload = unknown, Result = {}> {
    schema: {
        payload?: Schema<Payload>
        result?: Schema<Result>
    }
    handler: (request: Payload, context: LambdaContext<Configuration, Service, Profile>) => Promisable<Try<Result>>
}

export interface RawHandler<Configuration = never, Service = never, Profile = never, Payload = unknown, Result = {}>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    raw: RawEventHandler<Configuration, Service, Profile, Payload, Result>
}
