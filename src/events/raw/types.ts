import type { Promisable, Try } from '@skyleague/axioms'
import type { InferFromParser, MaybeGenericParser } from '../../parsers/types.js'
import type { EventHandlerDefinition, LambdaContext } from '../types.js'

export interface RawEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Payload extends MaybeGenericParser = MaybeGenericParser,
    Result extends MaybeGenericParser = MaybeGenericParser,
> {
    schema: {
        payload?: Payload
        result?: Result
    }
    handler: (
        request: NoInfer<InferFromParser<Payload, unknown>>,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<NoInfer<InferFromParser<Result, unknown>>>>
}

export interface RawHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Payload extends MaybeGenericParser = MaybeGenericParser,
    Result extends MaybeGenericParser = MaybeGenericParser,
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    raw: RawEventHandler<Configuration, Service, Profile, Payload, Result>
}
