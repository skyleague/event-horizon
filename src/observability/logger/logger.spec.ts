import { createLogger } from './logger.js'

import { forAll, string } from '@skyleague/axioms'
import { describe, expect, it, vi } from 'vitest'

describe('Logger', () => {
    const logger = createLogger()

    it('debug', () => {
        forAll(string(), (message) => {
            vi.spyOn(logger, 'debug').mockImplementation(() => {
                //
            })

            logger.debug(message)

            expect(logger.debug).toHaveBeenCalledWith(message)
        })
    })

    it('info', () => {
        forAll(string(), (message) => {
            vi.spyOn(logger, 'info').mockImplementation(() => {
                //
            })

            logger.info(message)

            expect(logger.info).toHaveBeenCalledWith(message)
        })
    })

    it('warn', () => {
        forAll(string(), (message) => {
            vi.spyOn(logger, 'warn').mockImplementation(() => {
                //
            })

            logger.warn(message)

            expect(logger.warn).toHaveBeenCalledWith(message)
        })
    })

    it('error', () => {
        forAll(string(), (message) => {
            vi.spyOn(logger, 'error').mockImplementation(() => {
                //
            })

            logger.error(message)

            expect(logger.error).toHaveBeenCalledWith(message)
        })
    })

    it('critical', () => {
        forAll(string(), (message) => {
            vi.spyOn(logger, 'critical').mockImplementation(() => {
                //
            })

            logger.critical(message)

            expect(logger.critical).toHaveBeenCalledWith(message)
        })
    })
})
