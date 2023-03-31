import { jest } from '@jest/globals'

global.jest = jest as typeof global.jest
process.env.IS_DEBUG = 'true'
