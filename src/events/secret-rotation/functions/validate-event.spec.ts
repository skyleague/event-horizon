import { secretValidateEvent } from './validate-event'

import { EventError } from '../../../errors/event-error'

import { asyncForAll, Nothing, tuple } from '@skyleague/axioms'
import { mock, secretRotationEvent, context } from '@skyleague/event-horizon-dev'
import type SecretsManager from 'aws-sdk/clients/secretsmanager'

describe('validate', () => {
    const services = {
        secretsManager: mock<SecretsManager>(),
    }

    beforeEach(() => services.secretsManager.mockClear())

    test('identity function when validates', async () => {
        await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
            ctx.mockClear()
            services.secretsManager.mockClear()

            const fn = secretValidateEvent(ctx)

            services.secretsManager.describeSecret.mockReturnValueOnce({
                promise: () =>
                    Promise.resolve({
                        RotationEnabled: true,
                        VersionIdsToStages: {
                            [rotation.clientRequestToken]: ['AWSPENDING'],
                        },
                    }),
            } as any)

            const response = await fn.before(rotation)
            expect(response).toEqual(rotation)
        })
    })

    test('fails when rotation is disabled', async () => {
        await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
            ctx.mockClear()
            services.secretsManager.mockClear()

            const fn = secretValidateEvent(ctx)

            services.secretsManager.describeSecret.mockReturnValueOnce({
                promise: () =>
                    Promise.resolve({
                        RotationEnabled: false,
                        VersionIdsToStages: {
                            [rotation.clientRequestToken]: ['AWSPENDING'],
                        },
                    }),
            } as any)

            const response = await fn.before(rotation)
            expect(response).toEqual(EventError.preconditionFailed())
        })
    })

    test('fails when crt is not available', async () => {
        await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
            ctx.mockClear()
            services.secretsManager.mockClear()

            const fn = secretValidateEvent(ctx)

            services.secretsManager.describeSecret.mockReturnValueOnce({
                promise: () =>
                    Promise.resolve({
                        RotationEnabled: true,
                    }),
            } as any)

            const response = await fn.before(rotation)
            expect(response).toEqual(EventError.preconditionFailed())
        })
    })

    test('Nothing when crt is current', async () => {
        await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
            ctx.mockClear()
            services.secretsManager.mockClear()

            const fn = secretValidateEvent(ctx)

            services.secretsManager.describeSecret.mockReturnValueOnce({
                promise: () =>
                    Promise.resolve({
                        RotationEnabled: true,
                        VersionIdsToStages: {
                            [rotation.clientRequestToken]: ['AWSCURRENT'],
                        },
                    }),
            } as any)

            const response = await fn.before(rotation)
            expect(response).toEqual(Nothing)
        })
    })

    test('fails when crt is not pending', async () => {
        await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
            ctx.mockClear()
            services.secretsManager.mockClear()

            const fn = secretValidateEvent(ctx)

            services.secretsManager.describeSecret.mockReturnValueOnce({
                promise: () =>
                    Promise.resolve({
                        RotationEnabled: true,
                        VersionIdsToStages: {
                            [rotation.clientRequestToken]: [],
                        },
                    }),
            } as any)

            const response = await fn.before(rotation)
            expect(response).toEqual(EventError.preconditionFailed())
        })
    })
})
