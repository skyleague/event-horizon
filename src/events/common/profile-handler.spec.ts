/* eslint-disable @typescript-eslint/require-await */
import { profileHandler } from './profile-handler'

import 'aws-sdk-client-mock-jest'
import { EventError } from '../../errors'

import {
    AppConfigData,
    AppConfigDataClient,
    GetLatestConfigurationCommand,
    StartConfigurationSessionCommand,
} from '@aws-sdk/client-appconfigdata'
import { asyncForAll, dict, json, string, tuple } from '@skyleague/axioms'
import { mockClient } from 'aws-sdk-client-mock'

describe('profile handler', () => {
    const appConfigDataMock = mockClient(AppConfigDataClient)
    const services = { appConfigData: new AppConfigData({}) }

    test('skips retrieving when not properly configured', async () => {
        await asyncForAll(dict(json()), async (x) => {
            const handler = profileHandler({}, async () => x)

            expect(await handler.before()).toEqual({})
        })
    })

    test('retrieve initial configuration, and validates', async () => {
        await asyncForAll(tuple(string(), dict(json())), async ([token, config]) => {
            appConfigDataMock.reset()
            appConfigDataMock.on(StartConfigurationSessionCommand).resolvesOnce({ InitialConfigurationToken: token })
            appConfigDataMock.on(GetLatestConfigurationCommand).resolvesOnce({ Configuration: JSON.stringify(config) as any })

            const handler = profileHandler(
                { profile: { schema: { schema: { type: 'object' }, is: () => true } } } as any,
                async () => services
            )

            expect(await handler.before()).toEqual(config)
            expect(appConfigDataMock).toReceiveCommandTimes(StartConfigurationSessionCommand, 1)
            expect(appConfigDataMock).toReceiveCommandTimes(GetLatestConfigurationCommand, 1)
            expect(appConfigDataMock).toReceiveCommandWith(GetLatestConfigurationCommand, { ConfigurationToken: token })
        })
    })

    test('retrieve initial configuration, and validates - caches results', async () => {
        await asyncForAll(tuple(string(), dict(json())), async ([token, config]) => {
            appConfigDataMock.reset()
            appConfigDataMock.on(StartConfigurationSessionCommand).resolvesOnce({ InitialConfigurationToken: token })
            appConfigDataMock.on(GetLatestConfigurationCommand).resolvesOnce({ Configuration: JSON.stringify(config) as any })

            const handler = profileHandler(
                { profile: { schema: { schema: { type: 'object' }, is: () => true } } } as any,
                async () => services
            )

            expect(await handler.before()).toEqual(config)
            expect(await handler.before()).toEqual(config)

            expect(appConfigDataMock).toReceiveCommandTimes(StartConfigurationSessionCommand, 1)
            expect(appConfigDataMock).toReceiveCommandTimes(GetLatestConfigurationCommand, 1)
            expect(appConfigDataMock).toReceiveCommandWith(GetLatestConfigurationCommand, { ConfigurationToken: token })
        })
    })

    test('retrieve initial configuration and updates, and validates', async () => {
        await asyncForAll(
            tuple(string(), string(), string(), dict(json())),
            async ([token1, token2, token3, config]) => {
                appConfigDataMock.reset()
                appConfigDataMock.on(StartConfigurationSessionCommand).resolvesOnce({ InitialConfigurationToken: token1 })
                appConfigDataMock
                    .on(GetLatestConfigurationCommand)
                    .resolvesOnce({ Configuration: JSON.stringify(config) as any, NextPollConfigurationToken: token2 })
                    .resolvesOnce({ Configuration: JSON.stringify(config) as any, NextPollConfigurationToken: token3 })

                const handler = profileHandler(
                    { profile: { maxAge: 0, schema: { schema: { type: 'object' }, is: () => true } } } as any,
                    async () => services
                )

                expect(await handler.before()).toEqual(config)

                jest.setSystemTime(new Date().getTime() + 10)

                expect(await handler.before()).toEqual(config)

                expect(appConfigDataMock).toReceiveCommandTimes(StartConfigurationSessionCommand, 1)
                expect(appConfigDataMock).toReceiveNthCommandWith(1, StartConfigurationSessionCommand, {})
                expect(appConfigDataMock).toReceiveNthCommandWith(2, GetLatestConfigurationCommand, {
                    ConfigurationToken: token1,
                })
                expect(appConfigDataMock).toReceiveNthCommandWith(3, GetLatestConfigurationCommand, {
                    ConfigurationToken: token2,
                })
            },
            { counterExample: ['', '', '', {}] }
        )
    })

    test('retrieve initial configuration and ignores empty configurations, and validates', async () => {
        await asyncForAll(tuple(string(), string(), string(), dict(json())), async ([token1, token2, token3, config]) => {
            appConfigDataMock.reset()
            appConfigDataMock.on(StartConfigurationSessionCommand).resolvesOnce({ InitialConfigurationToken: token1 })
            appConfigDataMock
                .on(GetLatestConfigurationCommand)
                .resolvesOnce({ Configuration: JSON.stringify(config) as any, NextPollConfigurationToken: token2 })
                .resolvesOnce({ Configuration: '' as any, NextPollConfigurationToken: token3 })

            const handler = profileHandler(
                { profile: { maxAge: 0, schema: { schema: { type: 'object' }, is: () => true } } } as any,
                async () => services
            )

            expect(await handler.before()).toEqual(config)

            jest.setSystemTime(new Date().getTime() + 10)

            expect(await handler.before()).toEqual(config)

            expect(appConfigDataMock).toReceiveCommandTimes(StartConfigurationSessionCommand, 1)
            expect(appConfigDataMock).toReceiveCommandTimes(GetLatestConfigurationCommand, 2)
            expect(appConfigDataMock).toReceiveNthCommandWith(1, StartConfigurationSessionCommand, {})
            expect(appConfigDataMock).toReceiveNthCommandWith(2, GetLatestConfigurationCommand, { ConfigurationToken: token1 })
            expect(appConfigDataMock).toReceiveNthCommandWith(3, GetLatestConfigurationCommand, { ConfigurationToken: token2 })
        })
    })

    test('retrieve initial configuration, and not validates', async () => {
        await asyncForAll(tuple(string(), dict(json())), async ([token, config]) => {
            appConfigDataMock.reset()
            appConfigDataMock.on(StartConfigurationSessionCommand).resolvesOnce({ InitialConfigurationToken: token })
            appConfigDataMock.on(GetLatestConfigurationCommand).resolvesOnce({ Configuration: JSON.stringify(config) as any })

            const handler = profileHandler(
                { profile: { schema: { schema: { type: 'object' }, is: () => false } } } as any,
                async () => services
            )

            await expect(handler.before()).rejects.toEqual(expect.any(EventError))

            expect(appConfigDataMock).toReceiveCommandTimes(StartConfigurationSessionCommand, 1)
            expect(appConfigDataMock).toReceiveCommandTimes(GetLatestConfigurationCommand, 1)
            expect(appConfigDataMock).toReceiveNthCommandWith(1, StartConfigurationSessionCommand, {})
            expect(appConfigDataMock).toReceiveNthCommandWith(2, GetLatestConfigurationCommand, { ConfigurationToken: token })
        })
    })
})
