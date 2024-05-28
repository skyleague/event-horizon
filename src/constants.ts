const isDebug = (process.env.EH_IS_DEBUG ?? process.env.IS_DEBUG) === 'true'
const logEventPayload = process.env.EH_LOG_EVENT_PAYLOAD ?? process.env.LOG_EVENT_PAYLOAD
const logResultPayload = process.env.EH_LOG_RESULT_PAYLOAD ?? process.env.LOG_RESULT_PAYLOAD

export interface ServiceConstants {
    serviceName: string
    isDebug: boolean
}

export const serviceConstants: ServiceConstants = {
    serviceName: process.env.EH_SERVICE_NAME ?? process.env.SERVICE_NAME ?? 'unknown-service',

    isDebug,
}

export interface MetricsConstants {
    namespace: string
}
export const metricsConstants = {
    namespace: process.env.EH_METRICS_NAMESPACE ?? process.env.METRICS_NAMESPACE ?? serviceConstants.serviceName,
}

export interface EventConstants {
    requestIdGenerator: 'uuid'
    requestIdHeader: string
    traceIdGenerator: 'uuid'
    traceIdHeader: string
}

export const eventConstants: EventConstants = {
    requestIdGenerator: (process.env.EH_REQUEST_ID_GENERATOR ?? process.env.REQUEST_ID_GENERATOR) === 'uuid' ? 'uuid' : 'uuid',
    requestIdHeader: process.env.EH_REQUEST_ID_HEADER ?? process.env.REQUEST_ID_HEADER ?? 'x-amz-request-id',
    traceIdGenerator: (process.env.EH_TRACE_ID_GENERATOR ?? process.env.TRACE_ID_GENERATOR) === 'uuid' ? 'uuid' : 'uuid',
    traceIdHeader: process.env.EH_TRACE_ID_HEADER ?? process.env.TRACE_ID_HEADER ?? 'x-trace-id',
}

export interface LoggingConstants {
    logEventPayload: boolean
    logResultPayload: boolean
}

export const loggingConstants: LoggingConstants = {
    logEventPayload: logEventPayload === 'true' || (isDebug && logEventPayload !== 'false'),
    logResultPayload: logResultPayload === 'true' || (isDebug && logResultPayload !== 'false'),
}

export interface InitConstants {
    eagerHandlerInitialization: boolean
}

export const initConstants: InitConstants = {
    eagerHandlerInitialization: (process.env.EH_EAGER_HANDLER_INIT ?? process.env.EAGER_HANDLER_INIT) === 'true',
}

export interface AppConfigConstants {
    application: string | undefined
    environment: string | undefined
    name: string | undefined
}

export const appConfigConstants: AppConfigConstants = {
    application:
        process.env.EH_APPCONFIG_APPLICATION ??
        // deprecated these
        process.env.APPCONFIG_APPLICATION ??
        process.env.EH_SERVICE_NAMESPACE ??
        process.env.SERVICE_NAMESPACE,
    environment:
        process.env.EH_APPCONFIG_ENVIRONMENT ??
        // deprecated these
        process.env.APPCONFIG_ENVIRONMENT ??
        process.env.EH_ENVIRONMENT ??
        process.env.ENVIRONMENT,
    name:
        process.env.EH_APPCONFIG_NAME ??
        // deprecated these
        process.env.APPCONFIG_NAME ??
        serviceConstants.serviceName,
}
