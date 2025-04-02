/**
 * Generated by @skyleague/therefore
 * Do not manually touch this
 */
/* eslint-disable */

export interface CloudWatchLogEventSchema {
    id: string
    timestamp: number
    message: string
}

export interface CloudWatchLogsDecodeSchema {
    messageType: string
    owner: string
    logGroup: string
    logStream: string
    subscriptionFilters: string[]
    logEvents: [CloudWatchLogEventSchema, ...CloudWatchLogEventSchema[]]
}

export interface CloudWatchLogsSchema {
    awslogs: {
        data: string
    }
}
