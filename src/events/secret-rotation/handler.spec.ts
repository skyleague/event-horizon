import { DescribeSecretCommand, SecretsManager, SecretsManagerClient } from '@aws-sdk/client-secrets-manager'
import { asyncForAll, failure, thrown, tuple } from '@skyleague/axioms'
import { mockClient } from 'aws-sdk-client-mock'
import { beforeEach, expect, it, vi } from 'vitest'
import { secretRotationEvent } from '../../dev/event-horizon/secret-rotation/secret-rotation.js'
import { EventError } from '../../errors/event-error/event-error.js'
import { context } from '../../test/context/context.js'
import { handleSecretRotationEvent } from './handler.js'

const mockSecrets = mockClient(SecretsManagerClient)
const services = {
    secretsManager: new SecretsManager({}),
}

beforeEach(() => {
    mockSecrets.reset()
})

it('success does not give failures', async () => {
    await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
        ctx.mockClear()
        mockSecrets.reset()

        mockSecrets.on(DescribeSecretCommand).resolvesOnce({
            RotationEnabled: true,
            VersionIdsToStages: {
                [rotation.clientRequestToken]: ['AWSPENDING'],
            },
        })

        const handler = vi.fn()
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

it('schema validation, gives failure', async () => {
    await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
        ctx.mockClear()
        mockSecrets.reset()

        mockSecrets.on(DescribeSecretCommand).resolvesOnce({
            RotationEnabled: true,
            VersionIdsToStages: {
                [rotation.clientRequestToken]: [],
            },
        })

        const handler = vi.fn()
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

it.each([new Error()])('%s - promise reject with Error, gives failure', async (error) => {
    await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
        ctx.mockClear()
        mockSecrets.reset()

        mockSecrets.on(DescribeSecretCommand).resolvesOnce({
            RotationEnabled: true,
            VersionIdsToStages: {
                [rotation.clientRequestToken]: ['AWSPENDING'],
            },
        })

        const handler = vi.fn().mockRejectedValue(error)
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

it.each([new Error(), EventError.badRequest(), 'foobar'])('%s - promise throws with Error, gives failure', async (error) => {
    await asyncForAll(tuple(secretRotationEvent(), await context({ services })), async ([rotation, ctx]) => {
        ctx.mockClear()
        mockSecrets.reset()

        mockSecrets.on(DescribeSecretCommand).resolvesOnce({
            RotationEnabled: true,
            VersionIdsToStages: {
                [rotation.clientRequestToken]: ['AWSPENDING'],
            },
        })

        const handler = vi.fn().mockImplementation(() => {
            throw error
        })
        const response = await handleSecretRotationEvent({ services, secretRotation: { handler } }, rotation.raw, ctx)

        expect(response).toEqual(thrown(failure(error)))

        expect(handler).toHaveBeenCalledWith(expect.objectContaining({ raw: rotation.raw }), ctx)

        expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[secret-rotation] start', {
            event: rotation.raw,
        })
        expect(ctx.logger.info).toHaveBeenNthCalledWith(2, `Starting secret rotation ${rotation.step}`)
        expect(ctx.logger.info).toHaveBeenNthCalledWith(3, '[secret-rotation] sent', { response: undefined })
        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})
