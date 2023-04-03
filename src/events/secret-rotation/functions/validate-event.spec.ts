import { secretValidateEvent } from './validate-event.js'

import { EventError } from '../../../errors/event-error/index.js'

import { DescribeSecretCommand, SecretsManager, SecretsManagerClient } from '@aws-sdk/client-secrets-manager'
import { asyncForAll, Nothing, tuple } from '@skyleague/axioms'
import { secretRotationEvent, context } from '@skyleague/event-horizon-dev'
import { mockClient } from 'aws-sdk-client-mock'

describe('validate', () => {
    const mockSecrets = mockClient(SecretsManagerClient)
    const services = {
        secretsManager: new SecretsManager({}),
    }

    beforeEach(() => mockSecrets.reset())

    test('identity function when validates', async () => {
        await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
            ctx.mockClear()
            mockSecrets.reset()

            const fn = secretValidateEvent(ctx)

            mockSecrets.on(DescribeSecretCommand).resolvesOnce({
                RotationEnabled: true,
                VersionIdsToStages: {
                    [rotation.clientRequestToken]: ['AWSPENDING'],
                },
            })

            const response = await fn.before(rotation)
            expect(response).toEqual(rotation)
        })
    })

    test('fails when rotation is disabled', async () => {
        await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
            ctx.mockClear()
            mockSecrets.reset()

            const fn = secretValidateEvent(ctx)
            mockSecrets.on(DescribeSecretCommand).resolvesOnce({
                RotationEnabled: false,
                VersionIdsToStages: {
                    [rotation.clientRequestToken]: ['AWSPENDING'],
                },
            })

            const response = await fn.before(rotation)
            expect(response).toEqual(EventError.preconditionFailed())
        })
    })

    test('fails when crt is not available', async () => {
        await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
            ctx.mockClear()
            mockSecrets.reset()

            const fn = secretValidateEvent(ctx)

            mockSecrets.on(DescribeSecretCommand).resolvesOnce({
                RotationEnabled: true,
            })

            const response = await fn.before(rotation)
            expect(response).toEqual(EventError.preconditionFailed())
        })
    })

    test('Nothing when crt is current', async () => {
        await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
            ctx.mockClear()
            mockSecrets.reset()

            const fn = secretValidateEvent(ctx)

            mockSecrets.on(DescribeSecretCommand).resolvesOnce({
                RotationEnabled: true,
                VersionIdsToStages: {
                    [rotation.clientRequestToken]: ['AWSCURRENT'],
                },
            })

            const response = await fn.before(rotation)
            expect(response).toEqual(Nothing)
        })
    })

    test('fails when crt is not pending', async () => {
        await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
            ctx.mockClear()
            mockSecrets.reset()

            const fn = secretValidateEvent(ctx)

            mockSecrets.on(DescribeSecretCommand).resolvesOnce({
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
