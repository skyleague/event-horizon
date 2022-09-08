export const serviceName = process.env.SERVICE_NAME ?? 'unknown-service'
export const namespace = process.env.SERVICE_NAMESPACE ?? 'unknown-service'
export const isDebug = process.env.IS_DEBUG === 'true'
export const logEventPayload = process.env.LOG_EVENT_PAYLOAD === 'true' || (isDebug && process.env.LOG_EVENT_PAYLOAD !== 'false')
export const logResultPayload =
    process.env.LOG_RESULT_PAYLOAD === 'true' || (isDebug && process.env.LOG_RESULT_PAYLOAD !== 'false')
