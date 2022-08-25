import { EventError } from './event-error'

test('EventError === EventError', () => {
    expect(EventError.is(EventError.badGateway())).toBe(true)
})
