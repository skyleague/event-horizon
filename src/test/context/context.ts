import { Context } from '../../aws/lambda/context.type.js'
import type { AsConfig } from '../../events/common/config.js'
import type { ProfileSchema } from '../../events/common/functions/profile-handler.js'
import type { Config, EventHandlerDefinition, LambdaContext, Services } from '../../events/types.js'
import type { MaybeGenericParser } from '../../parsers/types.js'
import { mockLogger, mockMetrics, mockTracer } from '../mock/mock.js'

import type { Arbitrary, Dependent } from '@skyleague/axioms'
import { constant, isFunction, object, string } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'

import { inspect } from 'node:util'

export async function context<Configuration = undefined, Service = undefined, Profile extends MaybeGenericParser = undefined>({
    config,
    services,
    profile,
    isSensitive,
}: Pick<EventHandlerDefinition, 'isSensitive'> & {
    config?: Config<Configuration>
    services?: Services<Configuration, Service>
    profile?: ProfileSchema<Profile>
} = {}): Promise<Dependent<LambdaContext<Configuration, Service, Profile> & { mockClear: () => void }>> {
    const configObj = isFunction(config) ? await config() : config
    const ctxArb = arbitrary(Context).map((ctx) => {
        return {
            ...ctx,
            getRemainingTimeInMillis: () => 10000,
            done: () => {
                //
            },
            fail: () => {
                //
            },
            succeed: () => {
                //
            },
        }
    })
    return object({
        logger: constant(mockLogger()),
        tracer: constant(mockTracer()),
        metrics: constant(mockMetrics()),
        requestId: string({ minLength: 2 }).constant(),
        traceId: string({ minLength: 2 }).constant(),
        isSensitive: constant(isSensitive ?? false),
        raw: ctxArb,
        config: constant(configObj) as Arbitrary<LambdaContext<Configuration, Service, Profile>['config']>,
        services: constant(isFunction(services) ? await services(configObj as AsConfig<Configuration>) : services) as Arbitrary<
            LambdaContext<Configuration, Service, Profile>['services']
        >,
        profile: (profile?.schema !== undefined ? arbitrary(profile.schema) : constant(undefined)) as Arbitrary<
            LambdaContext<Configuration, Service, Profile>['profile']
        >,

        getRemainingTimeInMillis: constant(() => 10000),
    })
        .constant()
        .map((o) => {
            return {
                ...o,
                mockClear: () => {
                    // reset state on each evaluation
                    o.logger.mockClear()
                    o.tracer.mockClear()
                    o.metrics.mockClear()
                },
                [inspect.custom]() {
                    return 'random(await context())'
                },
            }
        })
        .map((o) => {
            o.mockClear()
            return o
        })
        .constant()
}
