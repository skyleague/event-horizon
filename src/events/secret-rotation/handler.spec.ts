import { handleSecretRotationEvent } from './handler'

import { EventError } from '../../errors'

import { DescribeSecretCommand, SecretsManager, SecretsManagerClient } from '@aws-sdk/client-secrets-manager'
import { asyncForAll, failure, tuple } from '@skyleague/axioms'
import { context, secretRotationEvent } from '@skyleague/event-horizon-dev'
import { mockClient } from 'aws-sdk-client-mock'

describe('handler', () => {
    const mockSecrets = mockClient(SecretsManagerClient)
    const services = {
        secretsManager: new SecretsManager({}),
    }

    beforeEach(() => mockSecrets.reset())

    test('success does not give failures', async () => {
        await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
            ctx.mockClear()
            mockSecrets.reset()

            mockSecrets.on(DescribeSecretCommand).resolvesOnce({
                RotationEnabled: true,
                VersionIdsToStages: {
                    [rotation.clientRequestToken]: ['AWSPENDING'],
                },
            })

            const handler = jest.fn()
            const response = await handleSecretRotationEvent({ services, secretRotation: { handler } }, rotation.raw, ctx)

            expect(response).not.toBeDefined()

            expect(handler).toHaveBeenCalledWith(expect.objectContaining({ raw: rotation.raw }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[secret-rotation] start', {
                event: rotation.raw,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, `Starting secret rotation ${rotation.step}`)
            expect(ctx.logger.info).toHaveBeenNthCalledWith(3, '[secret-rotation] sent', { response: undefined })
            expect(ctx.logger.error).not.toHaveBeenCalled()
        })
    })

    test('schema validation, gives failure', async () => {
        await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
            ctx.mockClear()
            mockSecrets.reset()

            mockSecrets.on(DescribeSecretCommand).resolvesOnce({
                RotationEnabled: true,
                VersionIdsToStages: {
                    [rotation.clientRequestToken]: [],
                },
            })

            const handler = jest.fn()
            const response = await handleSecretRotationEvent({ services, secretRotation: { handler } }, rotation.raw, ctx)

            expect(response).toEqual(expect.any(EventError))

            expect(handler).not.toHaveBeenCalled()

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[secret-rotation] start', {
                event: rotation.raw,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, `Starting secret rotation ${rotation.step}`)
            expect(ctx.logger.info).toHaveBeenNthCalledWith(3, '[secret-rotation] sent', { response: undefined })
            expect(ctx.logger.error).toHaveBeenCalledWith('Secret version not set as AWSPENDING for rotation')
        })
    })

    test.each([new Error()])('promise reject with Error, gives failure', async (error) => {
        await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
            ctx.mockClear()
            mockSecrets.reset()

            mockSecrets.on(DescribeSecretCommand).resolvesOnce({
                RotationEnabled: true,
                VersionIdsToStages: {
                    [rotation.clientRequestToken]: ['AWSPENDING'],
                },
            })

            const handler = jest.fn().mockRejectedValue(error)
            const response = await handleSecretRotationEvent({ services, secretRotation: { handler } }, rotation.raw, ctx)

            expect(response).toEqual(error)

            expect(handler).toHaveBeenCalledWith(expect.objectContaining({ raw: rotation.raw }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[secret-rotation] start', {
                event: rotation.raw,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, `Starting secret rotation ${rotation.step}`)
            expect(ctx.logger.info).toHaveBeenNthCalledWith(3, '[secret-rotation] sent', { response: undefined })
            expect(ctx.logger.error).not.toHaveBeenCalled()
        })
    })

    test.each([new Error(), EventError.badRequest(), 'foobar'])('promise throws with Error, gives failure', async (error) => {
        await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
            ctx.mockClear()
            mockSecrets.reset()

            mockSecrets.on(DescribeSecretCommand).resolvesOnce({
                RotationEnabled: true,
                VersionIdsToStages: {
                    [rotation.clientRequestToken]: ['AWSPENDING'],
                },
            })

            const handler = jest.fn().mockImplementation(() => {
                throw error
            })
            const response = await handleSecretRotationEvent({ services, secretRotation: { handler } }, rotation.raw, ctx)

            expect(response).toEqual(failure(error))

            expect(handler).toHaveBeenCalledWith(expect.objectContaining({ raw: rotation.raw }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[secret-rotation] start', {
                event: rotation.raw,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, `Starting secret rotation ${rotation.step}`)
            expect(ctx.logger.info).toHaveBeenNthCalledWith(3, '[secret-rotation] sent', { response: undefined })
            expect(ctx.logger.error).not.toHaveBeenCalled()
        })
    })
})
