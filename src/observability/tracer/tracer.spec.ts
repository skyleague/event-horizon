import type { Tracer as AWSTracer } from '@aws-lambda-powertools/tracer'
import { asyncForAll, string, tuple, unknown } from '@skyleague/axioms'
import { beforeEach, expect, it, vi } from 'vitest'
import { createTracer } from './tracer.js'

const subsegment = {
    close: vi.fn(),
    flush: vi.fn(),
    mockClear: () => {
        subsegment.close.mockClear()
        subsegment.flush.mockClear()
    },
}
const instance = {
    addResponseAsMetadata: vi.fn(),
    addErrorAsMetadata: vi.fn(),
    isTracingEnabled: vi.fn(),
    provider: {
        captureAsyncFunc: vi.fn().mockImplementation((_segmentName, fn) => fn(subsegment)),
    },
    mockClear: () => {
        instance.addResponseAsMetadata.mockClear()
        instance.addErrorAsMetadata.mockClear()
        instance.isTracingEnabled.mockClear().mockReturnValue(true)
        instance.provider.captureAsyncFunc.mockClear()
    },
}
const tracer = createTracer(instance as unknown as AWSTracer)

beforeEach(() => instance.mockClear())

it('trace successful fn', async () => {
    await asyncForAll(tuple(string(), unknown()), async ([segment, response]) => {
        instance.mockClear()
        subsegment.mockClear()

        const fn = vi.fn().mockReturnValue(response)
        expect(await tracer.trace(segment, fn)).toBe(response)

        expect(instance.addResponseAsMetadata).toHaveBeenCalledWith(response, process.env._HANDLER)

        expect(subsegment.close).toHaveBeenCalled()
        expect(subsegment.flush).toHaveBeenCalled()
    })
})

it('trace rejected fn', async () => {
    await asyncForAll(tuple(string(), unknown()), async ([segment, response]) => {
        instance.mockClear()
        subsegment.mockClear()

        const fn = vi.fn().mockRejectedValue(response)

        await expect(() => tracer.trace(segment, fn)).rejects.toBe(response)

        expect(instance.addErrorAsMetadata).toHaveBeenCalledWith(response)

        expect(subsegment.close).toHaveBeenCalled()
        expect(subsegment.flush).toHaveBeenCalled()
    })
})

it('trace successful fn - disabled tracing', async () => {
    await asyncForAll(tuple(string(), unknown()), async ([segment, response]) => {
        instance.mockClear()
        subsegment.mockClear()
        instance.isTracingEnabled.mockReturnValue(false)

        const fn = vi.fn().mockReturnValue(response)
        expect(await tracer.trace(segment, fn)).toBe(response)

        expect(instance.addResponseAsMetadata).not.toHaveBeenCalled()

        expect(subsegment.close).not.toHaveBeenCalled()
        expect(subsegment.flush).not.toHaveBeenCalled()
    })
})

it('trace rejected fn - disabled tracing', async () => {
    await asyncForAll(tuple(string(), unknown()), async ([segment, response]) => {
        instance.mockClear()
        subsegment.mockClear()
        instance.isTracingEnabled.mockReturnValue(false)

        const fn = vi.fn().mockRejectedValue(response)

        await expect(() => tracer.trace(segment, fn)).rejects.toBe(response)

        expect(instance.addErrorAsMetadata).not.toHaveBeenCalled()

        expect(subsegment.close).not.toHaveBeenCalled()
        expect(subsegment.flush).not.toHaveBeenCalled()
    })
})
