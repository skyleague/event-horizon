import {
    APIGatewayProxyEventSchema,
    APIGatewayProxyEventV2Schema,
    APIGatewayRequestAuthorizerEventSchema,
    APIGatewayRequestAuthorizerEventV2Schema,
    DynamoDBStreamSchema,
    EventBridgeSchema,
    KinesisDataStreamSchema,
    KinesisFirehoseSchema,
    S3Schema,
    SnsSchema,
    SqsSchema,
} from '@aws-lambda-powertools/parser/schemas'
import { SecretsManager } from '@aws-sdk/client-secrets-manager'
import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import type { SetRequired } from '@skyleague/axioms/types'
import { type Schema, arbitrary } from '@skyleague/therefore'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { literalSchema, warmerEvent } from '../../../test/schema.js'
import { s3BatchEvent } from '../../aws/s3-batch/s3.schema.js'
import { secretRotationEvent } from '../../aws/secret-rotation/secret-rotation.schema.js'
import { context } from '../../test/context/context.js'
import type { DefaultServices, LambdaContext } from '../types.js'
import { secretRotationHandler } from './secret-rotation.js'
import type { SecretRotationRequest } from './types.js'

it('handles service and config types', () => {
    {
        const handler = secretRotationHandler({
            secretRotation: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<
                        LambdaContext<undefined, SetRequired<DefaultServices, 'secretsManager'>, undefined>
                    >()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<SetRequired<DefaultServices, 'secretsManager'>>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.secretRotation.handler).toEqualTypeOf<
            (
                request: NoInfer<SecretRotationRequest>,
                context: LambdaContext<undefined, SetRequired<DefaultServices, 'secretsManager'>, undefined>,
            ) => void
        >()
    }
    {
        const handler = secretRotationHandler({
            config: 'config' as const,
            secretRotation: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<
                        LambdaContext<'config', SetRequired<DefaultServices, 'secretsManager'>, undefined>
                    >()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<SetRequired<DefaultServices, 'secretsManager'>>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.secretRotation.handler).toEqualTypeOf<
            (
                request: NoInfer<SecretRotationRequest>,
                context: LambdaContext<'config', SetRequired<DefaultServices, 'secretsManager'>, undefined>,
            ) => void
        >()
    }
    {
        const handler = secretRotationHandler({
            config: () => 'config' as const,
            secretRotation: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<
                        LambdaContext<'config', SetRequired<DefaultServices, 'secretsManager'>, undefined>
                    >()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<SetRequired<DefaultServices, 'secretsManager'>>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.secretRotation.handler).toEqualTypeOf<
            (
                request: NoInfer<SecretRotationRequest>,
                context: LambdaContext<'config', SetRequired<DefaultServices, 'secretsManager'>, undefined>,
            ) => void
        >()
    }
    {
        const handler = secretRotationHandler({
            services: { services: 'services' as const, secretsManager: new SecretsManager({}) },
            secretRotation: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<
                        LambdaContext<
                            undefined,
                            {
                                services: 'services'
                                secretsManager: SecretsManager
                            },
                            undefined
                        >
                    >()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{
                        services: 'services'
                        secretsManager: SecretsManager
                    }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.secretRotation.handler).toEqualTypeOf<
            (
                request: NoInfer<SecretRotationRequest>,
                context: LambdaContext<
                    undefined,
                    {
                        services: 'services'
                        secretsManager: SecretsManager
                    },
                    undefined
                >,
            ) => void
        >()
    }
    {
        const handler = secretRotationHandler({
            services: () => ({ services: 'services' as const, secretsManager: new SecretsManager({}) }),
            secretRotation: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<
                        LambdaContext<undefined, { services: 'services'; secretsManager: SecretsManager }, undefined>
                    >()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{
                        services: 'services'
                        secretsManager: SecretsManager
                    }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.secretRotation.handler).toEqualTypeOf<
            (
                request: NoInfer<SecretRotationRequest>,
                context: LambdaContext<
                    undefined,
                    {
                        services: 'services'
                        secretsManager: SecretsManager
                    },
                    undefined
                >,
            ) => void
        >()
    }
    {
        const handler = secretRotationHandler({
            config: () => 'config' as const,
            services: () => ({ services: 'services' as const, secretsManager: new SecretsManager({}) }),
            secretRotation: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<
                        LambdaContext<'config', { services: 'services'; secretsManager: SecretsManager }, undefined>
                    >()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<{
                        services: 'services'
                        secretsManager: SecretsManager
                    }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.secretRotation.handler).toEqualTypeOf<
            (
                request: NoInfer<SecretRotationRequest>,
                context: LambdaContext<'config', { services: 'services'; secretsManager: SecretsManager }, undefined>,
            ) => void
        >()
    }
    {
        const handler = secretRotationHandler({
            profile: { schema: literalSchema<'profile'>() },
            secretRotation: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<
                        LambdaContext<undefined, SetRequired<DefaultServices, 'secretsManager'>, Schema<'profile'>>
                    >()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<SetRequired<DefaultServices, 'secretsManager'>>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()
                },
            },
        })
        expectTypeOf(handler.secretRotation.handler).toEqualTypeOf<
            (
                request: NoInfer<SecretRotationRequest>,
                context: LambdaContext<undefined, SetRequired<DefaultServices, 'secretsManager'>, Schema<'profile'>>,
            ) => void
        >()
    }
    {
        const handler = secretRotationHandler({
            profile: { schema: literalSchema<'profile'>() },
            secretRotation: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<
                        LambdaContext<undefined, SetRequired<DefaultServices, 'secretsManager'>, Schema<'profile'>>
                    >()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<SetRequired<DefaultServices, 'secretsManager'>>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()
                },
            },
        })
        expectTypeOf(handler.secretRotation.handler).toEqualTypeOf<
            (
                request: NoInfer<SecretRotationRequest>,
                context: LambdaContext<undefined, SetRequired<DefaultServices, 'secretsManager'>, Schema<'profile'>>,
            ) => void
        >()
    }
})

it('handles secret rotation events', async () => {
    const secretRotation = vi.fn()
    const services = { secretsManager: vi.fn() as unknown as SecretsManager }
    const handler = secretRotationHandler(
        {
            services,
            secretRotation: { handler: vi.fn() },
        },
        { _kernel: secretRotation },
    )
    await asyncForAll(tuple(arbitrary(secretRotationEvent), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        secretRotation.mockClear()
        secretRotation.mockReturnValue(ret)

        const response = await handler._options.handler(event, ctx)
        expect(response).toBe(ret)
        expect(secretRotation).toHaveBeenCalledWith(expect.anything(), event, ctx)
    })
})

it('does not handle non secret rotation events', async () => {
    const secretRotation = vi.fn()
    const services = { secretsManager: vi.fn() as unknown as SecretsManager }
    const handler = secretRotationHandler(
        {
            services,
            secretRotation: { handler: vi.fn() },
        },
        { _kernel: secretRotation },
    )
    await asyncForAll(
        tuple(
            oneOf(
                arbitrary(EventBridgeSchema),
                arbitrary(KinesisFirehoseSchema),
                arbitrary(APIGatewayProxyEventSchema),
                arbitrary(APIGatewayProxyEventV2Schema),
                arbitrary(APIGatewayRequestAuthorizerEventSchema),
                arbitrary(APIGatewayRequestAuthorizerEventV2Schema),
                arbitrary(KinesisDataStreamSchema),
                arbitrary(S3Schema),
                arbitrary(s3BatchEvent),
                // arbitrary(secretRotationEvent),
                arbitrary(SnsSchema),
                arbitrary(SqsSchema),
                arbitrary(DynamoDBStreamSchema),
            ),
            unknown(),
            await context(handler),
        ),
        async ([event, ret, ctx]) => {
            secretRotation.mockClear()
            secretRotation.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/,
            )
        },
    )
})

it('warmup should early exit', async () => {
    const secretRotation = vi.fn()
    const services = { secretsManager: vi.fn() as unknown as SecretsManager }
    const handler = secretRotationHandler(
        {
            services,
            secretRotation: { handler: secretRotation },
        },
        { _kernel: secretRotation },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(secretRotation).not.toHaveBeenCalled()
})
