import { profileHandler } from './profile-handler.js'

import { EventError } from '../../../errors/event-error/event-error.js'

import {
    AppConfigData,
    AppConfigDataClient,
    GetLatestConfigurationCommand,
    StartConfigurationSessionCommand,
} from '@aws-sdk/client-appconfigdata'
import { asyncForAll, constant, json, object, oneOf, record, string } from '@skyleague/axioms'
import { mockClient } from 'aws-sdk-client-mock'
import { expect, it, vi } from 'vitest'

const tokenArbitrary = string({ minLength: 1 })
const appConfigDataMock = mockClient(AppConfigDataClient)
const services = { appConfigData: new AppConfigData({}) }
const profileConfiguration = object({
    application: string({ minLength: 1, format: 'alpha-numeric' }),
    name: string({ minLength: 1, format: 'alpha-numeric' }),
    environment: string({ minLength: 1, format: 'alpha-numeric' }),
})

it('skips retrieving when not properly configured', async () => {
    await asyncForAll(record(json()), async (x) => {
        const handler = profileHandler({}, async () => x)

        expect(await handler.before()).toEqual({})
    })
})

it('fails precondition when expected', async () => {
    await asyncForAll(
        [
            object({
                application: oneOf(constant(undefined), constant(''), constant(' ')),
                name: oneOf(constant(undefined), constant(''), constant(' ')),
                environment: oneOf(constant(undefined), constant(''), constant(' ')),
            }),
            record(json()),
        ],
        async ([application, x]) => {
            const handler = profileHandler(
                { profile: { ...application, schema: { schema: { type: 'object' }, is: () => true } } } as any,
                async () => x,
            )
            await expect(async () => handler.before()).rejects.toThrowError(
                /Did not provide configuration parameters to load the AppConfig profile.*/,
            )
        },
    )
})

it('retrieve initial configuration, and validates', async () => {
    await asyncForAll([profileConfiguration, tokenArbitrary, record(json())], async ([application, token, config]) => {
        appConfigDataMock.reset()
        appConfigDataMock.on(StartConfigurationSessionCommand).resolvesOnce({ InitialConfigurationToken: token })
        appConfigDataMock.on(GetLatestConfigurationCommand).resolvesOnce({ Configuration: JSON.stringify(config) as any })

        const handler = profileHandler(
            { profile: { ...application, schema: { schema: { type: 'object' }, is: () => true } } } as any,
            async () => services,
        )

        expect(await handler.before()).toEqual(config)
        expect(appConfigDataMock).toReceiveCommandTimes(StartConfigurationSessionCommand, 1)
        expect(appConfigDataMock).toReceiveCommandTimes(GetLatestConfigurationCommand, 1)
        expect(appConfigDataMock).toReceiveCommandWith(GetLatestConfigurationCommand, { ConfigurationToken: token })
    })
})

it('retrieve initial configuration - buffer, and validates', async () => {
    await asyncForAll([profileConfiguration, tokenArbitrary, record(json())], async ([application, token, config]) => {
        appConfigDataMock.reset()
        appConfigDataMock.on(StartConfigurationSessionCommand).resolvesOnce({ InitialConfigurationToken: token })
        appConfigDataMock
            .on(GetLatestConfigurationCommand)
            .resolvesOnce({ Configuration: Buffer.from(JSON.stringify(config)) as any })

        const handler = profileHandler(
            { profile: { ...application, schema: { schema: { type: 'object' }, is: () => true } } } as any,
            async () => services,
        )

        expect(await handler.before()).toEqual(config)
        expect(appConfigDataMock).toReceiveCommandTimes(StartConfigurationSessionCommand, 1)
        expect(appConfigDataMock).toReceiveCommandTimes(GetLatestConfigurationCommand, 1)
        expect(appConfigDataMock).toReceiveCommandWith(GetLatestConfigurationCommand, { ConfigurationToken: token })
    })
})

it('retrieve initial configuration - Uint8Array, and validates', async () => {
    await asyncForAll([profileConfiguration, tokenArbitrary, record(json())], async ([application, token, config]) => {
        appConfigDataMock.reset()
        appConfigDataMock.on(StartConfigurationSessionCommand).resolvesOnce({ InitialConfigurationToken: token })
        appConfigDataMock
            .on(GetLatestConfigurationCommand)
            .resolvesOnce({ Configuration: Uint8Array.from(Buffer.from(JSON.stringify(config))) as any })

        const handler = profileHandler(
            { profile: { ...application, schema: { schema: { type: 'object' }, is: () => true } } } as any,
            async () => services,
        )

        expect(await handler.before()).toEqual(config)
        expect(appConfigDataMock).toReceiveCommandTimes(StartConfigurationSessionCommand, 1)
        expect(appConfigDataMock).toReceiveCommandTimes(GetLatestConfigurationCommand, 1)
        expect(appConfigDataMock).toReceiveCommandWith(GetLatestConfigurationCommand, { ConfigurationToken: token })
    })
})

it('retrieve initial configuration, and validates - caches results', async () => {
    await asyncForAll([profileConfiguration, tokenArbitrary, record(json())], async ([application, token, config]) => {
        appConfigDataMock.reset()
        appConfigDataMock.on(StartConfigurationSessionCommand).resolvesOnce({ InitialConfigurationToken: token })
        appConfigDataMock.on(GetLatestConfigurationCommand).resolvesOnce({ Configuration: JSON.stringify(config) as any })

        const handler = profileHandler(
            { profile: { ...application, schema: { schema: { type: 'object' }, is: () => true } } } as any,
            async () => services,
        )

        expect(await handler.before()).toEqual(config)
        expect(await handler.before()).toEqual(config)

        expect(appConfigDataMock).toReceiveCommandTimes(StartConfigurationSessionCommand, 1)
        expect(appConfigDataMock).toReceiveCommandTimes(GetLatestConfigurationCommand, 1)
        expect(appConfigDataMock).toReceiveCommandWith(GetLatestConfigurationCommand, { ConfigurationToken: token })
    })
})

it('retrieve initial configuration and updates, and validates', async () => {
    await asyncForAll(
        [profileConfiguration, tokenArbitrary, tokenArbitrary, tokenArbitrary, record(json())],
        async ([application, token1, token2, token3, config]) => {
            appConfigDataMock.reset()
            appConfigDataMock.on(StartConfigurationSessionCommand).resolvesOnce({ InitialConfigurationToken: token1 })
            appConfigDataMock
                .on(GetLatestConfigurationCommand)
                .resolvesOnce({ Configuration: JSON.stringify(config) as any, NextPollConfigurationToken: token2 })
                .resolvesOnce({ Configuration: JSON.stringify(config) as any, NextPollConfigurationToken: token3 })

            const handler = profileHandler(
                { profile: { ...application, maxAge: 0, schema: { schema: { type: 'object' }, is: () => true } } } as any,
                async () => services,
            )

            expect(await handler.before()).toEqual(config)

            vi.setSystemTime(new Date().getTime() + 10)

            expect(await handler.before()).toEqual(config)

            expect(appConfigDataMock).toReceiveCommandTimes(StartConfigurationSessionCommand, 1)
            expect(appConfigDataMock).toReceiveNthCommandWith(StartConfigurationSessionCommand, 1, {})
            expect(appConfigDataMock).toReceiveNthCommandWith(GetLatestConfigurationCommand, 1, {
                ConfigurationToken: token1,
            })
            expect(appConfigDataMock).toReceiveNthCommandWith(GetLatestConfigurationCommand, 2, {
                ConfigurationToken: token2,
            })
        },
    )
})

it('retrieve initial configuration and ignores empty configurations, and validates', async () => {
    await asyncForAll(
        [profileConfiguration, tokenArbitrary, tokenArbitrary, tokenArbitrary, record(json())],
        async ([application, token1, token2, token3, config]) => {
            appConfigDataMock.reset()
            appConfigDataMock.on(StartConfigurationSessionCommand).resolvesOnce({ InitialConfigurationToken: token1 })
            appConfigDataMock
                .on(GetLatestConfigurationCommand)
                .resolvesOnce({ Configuration: JSON.stringify(config) as any, NextPollConfigurationToken: token2 })
                .resolvesOnce({ Configuration: '' as any, NextPollConfigurationToken: token3 })

            const handler = profileHandler(
                { profile: { ...application, maxAge: 0, schema: { schema: { type: 'object' }, is: () => true } } } as any,
                async () => services,
            )

            expect(await handler.before()).toEqual(config)

            vi.setSystemTime(new Date().getTime() + 10)

            expect(await handler.before()).toEqual(config)

            expect(appConfigDataMock).toReceiveCommandTimes(StartConfigurationSessionCommand, 1)
            expect(appConfigDataMock).toReceiveCommandTimes(GetLatestConfigurationCommand, 2)
            expect(appConfigDataMock).toReceiveNthCommandWith(StartConfigurationSessionCommand, 1, {})
            expect(appConfigDataMock).toReceiveNthCommandWith(GetLatestConfigurationCommand, 1, {
                ConfigurationToken: token1,
            })
            expect(appConfigDataMock).toReceiveNthCommandWith(GetLatestConfigurationCommand, 2, {
                ConfigurationToken: token2,
            })
        },
    )
})

it('retrieve initial configuration, and not validates', async () => {
    await asyncForAll([profileConfiguration, tokenArbitrary, record(json())], async ([application, token, config]) => {
        appConfigDataMock.reset()
        appConfigDataMock.on(StartConfigurationSessionCommand).resolvesOnce({ InitialConfigurationToken: token })
        appConfigDataMock.on(GetLatestConfigurationCommand).resolvesOnce({ Configuration: JSON.stringify(config) as any })

        const handler = profileHandler(
            { profile: { ...application, schema: { schema: { type: 'object' }, is: () => false } } } as any,
            async () => services,
        )

        await expect(handler.before()).rejects.toEqual(expect.any(EventError))

        expect(appConfigDataMock).toReceiveCommandTimes(StartConfigurationSessionCommand, 1)
        expect(appConfigDataMock).toReceiveCommandTimes(GetLatestConfigurationCommand, 1)
        expect(appConfigDataMock).toReceiveNthCommandWith(StartConfigurationSessionCommand, 1, {})
        expect(appConfigDataMock).toReceiveNthCommandWith(GetLatestConfigurationCommand, 1, { ConfigurationToken: token })
    })
})
