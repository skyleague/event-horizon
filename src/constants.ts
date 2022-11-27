const isDebug = process.env.IS_DEBUG === 'true'
export const constants = {
    serviceName: process.env.SERVICE_NAME ?? 'unknown-service',
    namespace: process.env.SERVICE_NAMESPACE ?? 'unknown-service',
    isDebug,
    logEventPayload: process.env.LOG_EVENT_PAYLOAD === 'true' || (isDebug && process.env.LOG_EVENT_PAYLOAD !== 'false'),
    logResultPayload: process.env.LOG_RESULT_PAYLOAD === 'true' || (isDebug && process.env.LOG_RESULT_PAYLOAD !== 'false'),

    requestIdGenerator: process.env.REQUEST_ID_GENERATOR === 'uuid' ? 'uuid' : 'uuid',
    requestIdHeader: process.env.REQUEST_ID_HEADER ?? 'x-amz-request-id',
    traceIdGenerator: process.env.TRACE_ID_GENERATOR === 'uuid' ? 'uuid' : 'uuid',
    traceIdHeader: process.env.TRACE_ID_HEADER ?? 'x-trace-id',
    eagerHandlerInitialization: (process.env.EH_EAGER_HANDLER_INIT ?? process.env.EAGER_HANDLER_INIT) === 'true',
}
