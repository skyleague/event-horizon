import { DescribeSecretCommand, SecretsManager, SecretsManagerClient } from '@aws-sdk/client-secrets-manager'
import { asyncForAll, Nothing, tuple } from '@skyleague/axioms'
import { mockClient } from 'aws-sdk-client-mock'
import { beforeEach, describe, expect, it } from 'vitest'
import { secretRotationEvent } from '../../../dev/event-horizon/secret-rotation/secret-rotation.js'
import { EventError } from '../../../errors/event-error/event-error.js'
import { context } from '../../../test/context/context.js'
import { secretValidateEvent } from './validate-event.js'

describe('validate', () => {
    const mockSecrets = mockClient(SecretsManagerClient)
    const services = {
        secretsManager: new SecretsManager({}),
    }

    beforeEach(() => {
        mockSecrets.reset()
    })

    it('identity function when validates', async () => {
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

    it('fails when rotation is disabled', async () => {
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

    it('fails when crt is not available', async () => {
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

    it('Nothing when crt is current', async () => {
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

    it('fails when crt is not pending', async () => {
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
