import { createTracer } from './tracer.js'

import type { Tracer as AWSTracer } from '@aws-lambda-powertools/tracer'
import { asyncForAll, string, tuple, unknown } from '@skyleague/axioms'
import { expect, describe, beforeEach, it, vi } from 'vitest'

describe('tracer', () => {
    const instance = {
        getSegment: vi.fn(),
        setSegment: vi.fn(),
        addResponseAsMetadata: vi.fn(),
        addErrorAsMetadata: vi.fn(),
        mockClear: () => {
            instance.getSegment.mockClear()
            instance.setSegment.mockClear()
            instance.addResponseAsMetadata.mockClear()
            instance.addErrorAsMetadata.mockClear()
        },
    }
    const tracer = createTracer(instance as unknown as AWSTracer)

    beforeEach(() => instance.mockClear())

    it('trace successful fn', async () => {
        await asyncForAll(tuple(string(), unknown()), async ([segment, response]) => {
            instance.mockClear()

            const current = { addNewSubsegment: vi.fn() }

            const subsegment = { close: vi.fn() }

            current.addNewSubsegment.mockReturnValue(subsegment as any)
            instance.getSegment.mockReturnValue(current as any)

            const fn = vi.fn().mockReturnValue(response)

            expect(await tracer.trace(segment, fn)).toBe(response)

            expect(instance.setSegment).toHaveBeenNthCalledWith(1, subsegment)
            expect(instance.setSegment).toHaveBeenNthCalledWith(2, current)

            expect(instance.addResponseAsMetadata).toHaveBeenCalledWith(response, process.env._HANDLER)

            expect(subsegment.close).toHaveBeenCalled()
        })
    })

    it('trace rejected fn', async () => {
        await asyncForAll(tuple(string(), unknown()), async ([segment, response]) => {
            instance.mockClear()

            const current = { addNewSubsegment: vi.fn() }

            const subsegment = { close: vi.fn() }

            current.addNewSubsegment.mockReturnValue(subsegment as any)
            instance.getSegment.mockReturnValue(current as any)

            const fn = vi.fn().mockRejectedValue(response)

            await expect(() => tracer.trace(segment, fn)).rejects.toBe(response)

            expect(instance.setSegment).toHaveBeenNthCalledWith(1, subsegment)
            expect(instance.setSegment).toHaveBeenNthCalledWith(2, current)

            expect(instance.addErrorAsMetadata).toHaveBeenCalledWith(response)

            expect(subsegment.close).toHaveBeenCalled()
        })
    })
})
