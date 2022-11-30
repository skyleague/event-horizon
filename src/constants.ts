const isDebug = (process.env.EH_IS_DEBUG ?? process.env.IS_DEBUG) === 'true'
const logEventPayload = process.env.EH_LOG_EVENT_PAYLOAD ?? process.env.LOG_EVENT_PAYLOAD
const logResultPayload = process.env.EH_LOG_RESULT_PAYLOAD ?? process.env.LOG_RESULT_PAYLOAD
export const constants = {
    serviceName: process.env.EH_SERVICE_NAME ?? process.env.SERVICE_NAME ?? 'unknown-service',
    namespace: process.env.EH_SERVICE_NAMESPACE ?? process.env.SERVICE_NAMESPACE ?? 'unknown-service',
    environment: process.env.EH_ENVIRONMENT ?? process.env.ENVIRONMENT ?? 'dev',
    isDebug,
    logEventPayload: logEventPayload === 'true' || (isDebug && logEventPayload !== 'false'),
    logResultPayload: logResultPayload === 'true' || (isDebug && logResultPayload !== 'false'),

    requestIdGenerator: (process.env.EH_REQUEST_ID_GENERATOR ?? process.env.REQUEST_ID_GENERATOR) === 'uuid' ? 'uuid' : 'uuid',
    requestIdHeader: process.env.EH_REQUEST_ID_HEADER ?? process.env.REQUEST_ID_HEADER ?? 'x-amz-request-id',
    traceIdGenerator: (process.env.EH_TRACE_ID_GENERATOR ?? process.env.TRACE_ID_GENERATOR) === 'uuid' ? 'uuid' : 'uuid',
    traceIdHeader: process.env.EH_TRACE_ID_HEADER ?? process.env.TRACE_ID_HEADER ?? 'x-trace-id',
    eagerHandlerInitialization: (process.env.EH_EAGER_HANDLER_INIT ?? process.env.EAGER_HANDLER_INIT) === 'true',
}
