import { EventError } from './event-error'

test('HttpError === HttpError', () => {
    expect(EventError.is(EventError.badGateway())).toBe(true)
})
