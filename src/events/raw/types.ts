import type { EventHandlerDefinition, LambdaContext } from '../types.js'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'

export interface RawEventHandler<Configuration = unknown, Service = unknown, Profile = unknown, Payload = unknown, Result = any> {
    schema: {
        payload?: Schema<Payload>
        result?: Schema<Result>
    }
    handler: NoInfer<(request: Payload, context: LambdaContext<Configuration, Service, Profile>) => Promisable<Try<Result>>>
}

export interface RawHandler<Configuration = unknown, Service = unknown, Profile = unknown, Payload = unknown, Result = any>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    raw: RawEventHandler<Configuration, Service, Profile, Payload, Result>
}
