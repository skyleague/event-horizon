import { createTracer } from './tracer'

import type { Tracer as AWSTracer } from '@aws-lambda-powertools/tracer'
import { asyncForAll, string, tuple, unknown } from '@skyleague/axioms'
import { mock } from '@skyleague/event-horizon-dev'

describe('tracer', () => {
    const instance = mock<AWSTracer>()
    const tracer = createTracer(instance)

    beforeEach(() => instance.mockClear())

    test('trace successful fn', async () => {
        await asyncForAll(tuple(string(), unknown()), async ([segment, response]) => {
            instance.mockClear()

            const current = { addNewSubsegment: jest.fn() }

            const subsegment = { close: jest.fn() }

            current.addNewSubsegment.mockReturnValue(subsegment as any)
            instance.getSegment.mockReturnValue(current as any)

            const fn = jest.fn().mockReturnValue(response)

            expect(await tracer.trace(segment, fn)).toBe(response)

            expect(instance.setSegment).toHaveBeenNthCalledWith(1, subsegment)
            expect(instance.setSegment).toHaveBeenNthCalledWith(2, current)

            expect(instance.addResponseAsMetadata).toHaveBeenCalledWith(response, process.env._HANDLER)

            expect(subsegment.close).toHaveBeenCalled()
        })
    })

    test('trace rejected fn', async () => {
        await asyncForAll(tuple(string(), unknown()), async ([segment, response]) => {
            instance.mockClear()

            const current = { addNewSubsegment: jest.fn() }

            const subsegment = { close: jest.fn() }

            current.addNewSubsegment.mockReturnValue(subsegment as any)
            instance.getSegment.mockReturnValue(current as any)

            const fn = jest.fn().mockRejectedValue(response)

            await expect(() => tracer.trace(segment, fn)).rejects.toBe(response)

            expect(instance.setSegment).toHaveBeenNthCalledWith(1, subsegment)
            expect(instance.setSegment).toHaveBeenNthCalledWith(2, current)

            expect(instance.addErrorAsMetadata).toHaveBeenCalledWith(response)

            expect(subsegment.close).toHaveBeenCalled()
        })
    })
})
