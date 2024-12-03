import type { Try } from '@skyleague/axioms'
import { EventError } from '../../../../errors/event-error/event-error.js'
import { safeParse } from '../../../../parsers/parse.js'
import type { MaybeGenericParser } from '../../../../parsers/types.js'
import type { EventFromHandler } from '../../../types.js'
import type { GatewayVersion } from '../../event/types.js'
import type { RequestAuthorizerEvent, RequestAuthorizerEventHandler, SecuritySchemes } from '../types.js'

export function authorizerIOValidate<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Path extends MaybeGenericParser,
    Query extends MaybeGenericParser,
    Headers extends MaybeGenericParser,
    Context extends MaybeGenericParser,
    Security extends SecuritySchemes | undefined,
    GV extends GatewayVersion,
>(http: RequestAuthorizerEventHandler<Configuration, Service, Profile, Path, Query, Headers, Context, Security, GV>) {
    return {
        before: async (
            event: RequestAuthorizerEvent,
        ): Promise<
            Try<
                EventFromHandler<
                    RequestAuthorizerEventHandler<Configuration, Service, Profile, Path, Query, Headers, Context, Security, GV>
                >
            >
        > => {
            const queryResult = await safeParse(http.schema?.query, event.query, { location: 'query' })
            if (queryResult instanceof EventError) {
                return queryResult
            }

            const pathResult = await safeParse(http.schema?.path, event.path, { location: 'path' })
            if (pathResult instanceof EventError) {
                return pathResult
            }

            const headersResult = await safeParse(http.schema?.headers, event.headers, { location: 'headers' })
            if (headersResult instanceof EventError) {
                return headersResult
            }

            return event as EventFromHandler<
                RequestAuthorizerEventHandler<Configuration, Service, Profile, Path, Query, Headers, Context, Security, GV>
            >
        },
    }
}
