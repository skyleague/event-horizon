import { Logger as AwsLogger } from '@aws-lambda-powertools/logger'
import { Metrics as AwsMetrics } from '@aws-lambda-powertools/metrics'
import { Tracer as AwsTracer } from '@aws-lambda-powertools/tracer'
import { vi } from 'vitest'
import type { Logger } from '../../observability/logger/logger.js'
import type { Metrics } from '../../observability/metrics/metrics.js'
import type { Tracer } from '../../observability/tracer/tracer.js'

type MockLogger = Logger & { mockClear: () => void }
export function mockLogger() {
    const instance = new AwsLogger()
    const shouldLogEvent = vi.spyOn(instance, 'shouldLogEvent')
    shouldLogEvent.mockReturnValue(false)
    // biome-ignore lint/suspicious/noExplicitAny: circular instantiation
    const impl: any = vi.mocked({
        instance,
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        critical: vi.fn(),
        child: vi.fn().mockImplementation(() => logger),
        setBindings: vi.fn(),
        mockClear: () => {
            impl.debug.mockClear()
            impl.info.mockClear()
            impl.warn.mockClear()
            impl.error.mockClear()
            impl.critical.mockClear()
            impl.child.mockClear()
            impl.setBindings.mockClear()
            impl.child.mockImplementation(() => logger)
            shouldLogEvent.mockClear()
            shouldLogEvent.mockReturnValue(false)
        },
    } as const)
    const logger = vi.mocked<MockLogger>(impl)
    return logger
}

export function mockTracer() {
    const instance = new AwsTracer()
    const tracer = vi.mocked<Tracer & { mockClear: () => void }>({
        instance,
        trace: vi.fn(),
        captureAWSv3Client: vi.fn(),
        mockClear: () => {
            tracer.trace.mockClear()
            tracer.captureAWSv3Client.mockClear()
        },
    })
    return tracer
}

export function mockMetrics() {
    const instance = new AwsMetrics()
    const metrics = vi.mocked<Metrics & { mockClear: () => void }>({
        instance,
        add: vi.fn(),
        mockClear: () => {
            metrics.add.mockClear()
        },
    })
    return metrics
}
