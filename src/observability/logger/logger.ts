import { LogFormatter } from './formatter'

import { serviceName } from '../../constants'

import { Logger as AwsLogger } from '@aws-lambda-powertools/logger'

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

export function createLogger(instance: AwsLogger = new AwsLogger({ serviceName, logFormatter: new LogFormatter() })): Logger {
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
        return createLogger(instance.createChild(bindings ? { persistentLogAttributes: bindings } : undefined))
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
