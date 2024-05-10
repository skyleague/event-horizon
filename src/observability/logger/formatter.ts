import { EventError } from '../../errors/event-error/event-error.js'

import { LogFormatter as AWSLogFormatter, LogItem } from '@aws-lambda-powertools/logger'
import type { LogAttributes, UnformattedAttributes } from '@aws-lambda-powertools/logger/types'

export class LogFormatter extends AWSLogFormatter {
    public formatAttributes(attributes: UnformattedAttributes, additionalLogAttributes: LogAttributes): LogItem {
        // same as default https://github.com/aws-powertools/powertools-lambda-typescript/blob/main/packages/logger/src/formatter/PowertoolsLogFormatter.ts#L25
        const baseAttributes = {
            cold_start: attributes.lambdaContext?.coldStart,
            function_arn: attributes.lambdaContext?.invokedFunctionArn,
            function_memory_size: attributes.lambdaContext?.memoryLimitInMB,
            function_name: attributes.lambdaContext?.functionName,
            function_request_id: attributes.lambdaContext?.awsRequestId,
            level: attributes.logLevel,
            message: attributes.message,
            sampling_rate: attributes.sampleRateValue,
            service: attributes.serviceName,
            timestamp: this.formatTimestamp(attributes.timestamp),
            xray_trace_id: attributes.xRayTraceId,
        }
        const powertoolsLogItem = new LogItem({ attributes: baseAttributes })
        powertoolsLogItem.addAttributes(additionalLogAttributes)

        return powertoolsLogItem
    }

    public override formatError(error: Error | EventError): LogAttributes {
        const formatted = super.formatError(error)
        if (EventError.is(error)) {
            return {
                ...formatted,
                attributes: error.attributes,
                headers: error.headers,
                statusCode: error.statusCode,
            }
        }
        return formatted
    }
}
