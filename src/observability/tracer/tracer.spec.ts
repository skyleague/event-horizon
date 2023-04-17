import { createTracer } from './tracer.js'

import type { Tracer as AWSTracer } from '@aws-lambda-powertools/tracer'
import { asyncForAll, string, tuple, unknown } from '@skyleague/axioms'
import { unsafeMock } from '@skyleague/event-horizon-dev'
import { expect, describe, beforeEach, it, vi } from 'vitest'

describe('tracer', () => {
    const instance = unsafeMock<AWSTracer>()
    const tracer = createTracer(instance)

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
