import type { EventHandlerDefinition, LambdaContext } from '../types.js'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'

export interface RawEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile = unknown,
    Payload = unknown,
    Result = unknown,
> {
    schema: {
        payload?: Schema<Payload>
        result?: Schema<Result>
    }
    handler: (
        request: NoInfer<Payload>,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<NoInfer<Result>>>
}

export interface RawHandler<Configuration = unknown, Service = unknown, Profile = unknown, Payload = unknown, Result = unknown>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    raw: RawEventHandler<Configuration, Service, Profile, Payload, Result>
}
