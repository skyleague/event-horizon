import { createLogger } from './logger.js'

import { forAll, string } from '@skyleague/axioms'

describe('Logger', () => {
    const logger = createLogger()

    test('debug', () => {
        forAll(string(), (message) => {
            jest.spyOn(logger, 'debug').mockImplementation(() => {
                //
            })

            logger.debug(message)

            expect(logger.debug).toHaveBeenCalledWith(message)
        })
    })

    test('info', () => {
        forAll(string(), (message) => {
            jest.spyOn(logger, 'info').mockImplementation(() => {
                //
            })

            logger.info(message)

            expect(logger.info).toHaveBeenCalledWith(message)
        })
    })

    test('warn', () => {
        forAll(string(), (message) => {
            jest.spyOn(logger, 'warn').mockImplementation(() => {
                //
            })

            logger.warn(message)

            expect(logger.warn).toHaveBeenCalledWith(message)
        })
    })

    test('error', () => {
        forAll(string(), (message) => {
            jest.spyOn(logger, 'error').mockImplementation(() => {
                //
            })

            logger.error(message)

            expect(logger.error).toHaveBeenCalledWith(message)
        })
    })
})
