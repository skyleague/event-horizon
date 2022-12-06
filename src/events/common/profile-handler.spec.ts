/* eslint-disable @typescript-eslint/require-await */
import { profileHandler } from './profile-handler'

import { EventError } from '../../errors'

import { asyncForAll, dict, json, string, tuple } from '@skyleague/axioms'
import AppConfigData from 'aws-sdk/clients/appconfigdata'

describe('profile handler', () => {
    const appConfigData = new AppConfigData()
    const services = { appConfigData }

    test('skips retrieving when not properly configured', async () => {
        await asyncForAll(dict(json()), async (x) => {
            const handler = profileHandler({}, async () => x)

            expect(await handler.before()).toEqual({})
        })
    })

    test('retrieve initial configuration, and validates', async () => {
        await asyncForAll(tuple(string(), dict(json())), async ([token, config]) => {
            jest.clearAllMocks()
            jest.spyOn(appConfigData, 'startConfigurationSession').mockReturnValue({
                promise: () => ({ InitialConfigurationToken: token }),
            } as any)
            jest.spyOn(appConfigData, 'getLatestConfiguration').mockReturnValue({
                promise: () => ({ Configuration: JSON.stringify(config) }),
            } as any)

            const handler = profileHandler(
                { profile: { schema: { schema: { type: 'object' }, is: () => true } } } as any,
                async () => services
            )

            expect(await handler.before()).toEqual(config)
            expect(appConfigData.startConfigurationSession).toHaveBeenCalledTimes(1)
            expect(appConfigData.getLatestConfiguration).toHaveBeenCalledTimes(1)
            expect(appConfigData.getLatestConfiguration).toHaveBeenCalledWith({ ConfigurationToken: token })
        })
    })

    test('retrieve initial configuration, and validates - caches results', async () => {
        await asyncForAll(tuple(string(), dict(json())), async ([token, config]) => {
            jest.clearAllMocks()
            jest.spyOn(appConfigData, 'startConfigurationSession').mockReturnValue({
                promise: () => ({ InitialConfigurationToken: token }),
            } as any)
            jest.spyOn(appConfigData, 'getLatestConfiguration').mockReturnValue({
                promise: () => ({ Configuration: JSON.stringify(config) }),
            } as any)

            const handler = profileHandler(
                { profile: { schema: { schema: { type: 'object' }, is: () => true } } } as any,
                async () => services
            )

            expect(await handler.before()).toEqual(config)
            expect(await handler.before()).toEqual(config)
            expect(appConfigData.startConfigurationSession).toHaveBeenCalledTimes(1)
            expect(appConfigData.getLatestConfiguration).toHaveBeenCalledTimes(1)
            expect(appConfigData.getLatestConfiguration).toHaveBeenCalledWith({ ConfigurationToken: token })
        })
    })

    test('retrieve initial configuration and updates, and validates', async () => {
        await asyncForAll(tuple(string(), string(), dict(json())), async ([token1, token2, config]) => {
            jest.clearAllMocks()
            jest.spyOn(appConfigData, 'startConfigurationSession').mockReturnValue({
                promise: () => ({ InitialConfigurationToken: token1 }),
            } as any)
            jest.spyOn(appConfigData, 'getLatestConfiguration').mockReturnValue({
                promise: () => ({ Configuration: JSON.stringify(config), NextPollConfigurationToken: token2 }),
            } as any)

            const handler = profileHandler(
                { profile: { maxAge: 0, schema: { schema: { type: 'object' }, is: () => true } } } as any,
                async () => services
            )

            expect(await handler.before()).toEqual(config)

            jest.setSystemTime(new Date().getTime() + 10)

            expect(await handler.before()).toEqual(config)

            expect(appConfigData.startConfigurationSession).toHaveBeenCalledTimes(1)
            expect(appConfigData.getLatestConfiguration).toHaveBeenCalledTimes(2)
            expect(appConfigData.getLatestConfiguration).toHaveBeenNthCalledWith(1, { ConfigurationToken: token1 })
            expect(appConfigData.getLatestConfiguration).toHaveBeenNthCalledWith(2, { ConfigurationToken: token2 })
        })
    })

    test('retrieve initial configuration and ignores empty configurations, and validates', async () => {
        await asyncForAll(tuple(string(), string(), string(), dict(json())), async ([token1, token2, token3, config]) => {
            jest.clearAllMocks()
            jest.spyOn(appConfigData, 'startConfigurationSession').mockReturnValue({
                promise: () => ({ InitialConfigurationToken: token1 }),
            } as any)
            jest.spyOn(appConfigData, 'getLatestConfiguration')
                .mockReturnValueOnce({
                    promise: () => ({ Configuration: JSON.stringify(config), NextPollConfigurationToken: token2 }),
                } as any)
                .mockReturnValueOnce({
                    promise: () => ({ Configuration: '', NextPollConfigurationToken: token3 }),
                } as any)

            const handler = profileHandler(
                { profile: { maxAge: 0, schema: { schema: { type: 'object' }, is: () => true } } } as any,
                async () => services
            )

            expect(await handler.before()).toEqual(config)

            jest.setSystemTime(new Date().getTime() + 10)

            expect(await handler.before()).toEqual(config)

            expect(appConfigData.startConfigurationSession).toHaveBeenCalledTimes(1)
            expect(appConfigData.getLatestConfiguration).toHaveBeenCalledTimes(2)
            expect(appConfigData.getLatestConfiguration).toHaveBeenNthCalledWith(1, { ConfigurationToken: token1 })
            expect(appConfigData.getLatestConfiguration).toHaveBeenNthCalledWith(2, { ConfigurationToken: token2 })
        })
    })

    test('retrieve initial configuration, and not validates', async () => {
        await asyncForAll(tuple(string(), dict(json())), async ([token, config]) => {
            jest.clearAllMocks()
            jest.spyOn(appConfigData, 'startConfigurationSession').mockReturnValue({
                promise: () => ({ InitialConfigurationToken: token }),
            } as any)
            jest.spyOn(appConfigData, 'getLatestConfiguration').mockReturnValue({
                promise: () => ({ Configuration: JSON.stringify(config) }),
            } as any)

            const handler = profileHandler(
                { profile: { schema: { schema: { type: 'object' }, is: () => false } } } as any,
                async () => services
            )

            await expect(handler.before()).rejects.toEqual(expect.any(EventError))
            expect(appConfigData.startConfigurationSession).toHaveBeenCalledTimes(1)
            expect(appConfigData.getLatestConfiguration).toHaveBeenCalledTimes(1)
            expect(appConfigData.getLatestConfiguration).toHaveBeenCalledWith({ ConfigurationToken: token })
        })
    })
})
