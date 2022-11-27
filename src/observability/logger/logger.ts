import { LogFormatter } from './formatter'

import { constants } from '../../constants'

import { Logger as AwsLogger } from '@aws-lambda-powertools/logger'
import type { ConstructorOptions } from '@aws-lambda-powertools/logger/lib/types'
import { mergeDeep } from '@skyleague/axioms'

export type LogItemObject = {
    [key: string]: unknown
    message: string
}
export type LogItem = LogItemObject | string
export type LogItemExtra = Record<string, unknown>[] | [Error | string]

export interface Logger {
    instance: AwsLogger
    debug: (input: LogItem, ...extraInput: LogItemExtra) => void
    info: (input: LogItem, ...extraInput: LogItemExtra) => void
    warn: (input: LogItem, ...extraInput: LogItemExtra) => void
    error: (input: LogItem, ...extraInput: LogItemExtra) => void
    child: (bindings?: Record<string, unknown>) => Logger
    setBindings: (bindings: Record<string, unknown>) => void
}

export function createLogger(
    options: ConstructorOptions | { instance: AwsLogger } = {
        serviceName: constants.serviceName,
        logFormatter: new LogFormatter(),
    }
): Logger {
    const instance: AwsLogger = 'instance' in options ? options.instance : new AwsLogger(options)

    function debug(input: LogItem, ...extraInput: LogItemExtra): void {
        instance.debug(input, ...extraInput)
    }

    function info(input: LogItem, ...extraInput: LogItemExtra): void {
        instance.info(input, ...extraInput)
    }

    function warn(input: LogItem, ...extraInput: LogItemExtra): void {
        instance.warn(input, ...extraInput)
    }

    function error(input: LogItem, ...extraInput: LogItemExtra): void {
        instance.error(input, ...extraInput)
    }

    function child(bindings?: Record<string, unknown>): Logger {
        // pass down the error formatter and attributes properly
        const parentAttributes = instance.getPersistentLogAttributes()
        return createLogger({
            ...options,
            persistentLogAttributes: bindings ? mergeDeep(bindings, parentAttributes) : parentAttributes,
        })
    }

    function setBindings(bindings: Record<string, unknown>): void {
        instance.setPersistentLogAttributes(bindings)
    }

    return {
        instance,
        debug,
        info,
        warn,
        error,
        child,
        setBindings,
    }
}

export const logger = createLogger()
