import type { Try } from '@skyleague/axioms'
import { EventError } from '../../../../errors/event-error/event-error.js'
import { safeParse } from '../../../../parsers/parse.js'
import type { MaybeGenericParser } from '../../../../parsers/types.js'
import type { EventFromHandler } from '../../../types.js'
import type { SecurityRequirements } from '../../types.js'
import type { GatewayVersion, HTTPEventHandler, HTTPRequest, Responses } from '../types.js'

export function httpIOValidate<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Body extends MaybeGenericParser,
    Path extends MaybeGenericParser,
    Query extends MaybeGenericParser,
    Headers extends MaybeGenericParser,
    Result extends Responses,
    Security extends SecurityRequirements | undefined,
    GV extends GatewayVersion,
>(http: HTTPEventHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, Security, GV>) {
    return {
        before: async (
            event: HTTPRequest,
        ): Promise<
            Try<
                EventFromHandler<
                    HTTPEventHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, Security, GV>
                >
            >
        > => {
            const bodyResult = await safeParse(http.schema.body, event.body, { location: 'body' })
            if (bodyResult instanceof EventError) {
                return bodyResult
            }

            const queryResult = await safeParse(http.schema.query, event.query, { location: 'query' })
            if (queryResult instanceof EventError) {
                return queryResult
            }

            const pathResult = await safeParse(http.schema.path, event.path, { location: 'path' })
            if (pathResult instanceof EventError) {
                return pathResult
            }

            const headersResult = await safeParse(http.schema.headers, event.headers, { location: 'headers' })
            if (headersResult instanceof EventError) {
                return headersResult
            }

            if (http.schema.authorizer !== undefined) {
                if ('jwt' in http.schema.authorizer && http.schema.authorizer.jwt !== true && 'claims' in event.authorizer) {
                    const jwtResult = await safeParse(http.schema.authorizer.jwt, event.authorizer.claims, {
                        location: 'authorizer.jwt',
                    })
                    if (jwtResult instanceof EventError) {
                        return jwtResult
                    }
                }
                if ('lambda' in http.schema.authorizer && http.schema.authorizer.lambda !== true) {
                    const lambdaResult = await safeParse(http.schema.authorizer.lambda, event.authorizer, {
                        location: 'authorizer.lambda',
                    })
                    if (lambdaResult instanceof EventError) {
                        return lambdaResult
                    }
                }
            }

            return event as EventFromHandler<
                HTTPEventHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, Security, GV>
            >
        },
    }
}
