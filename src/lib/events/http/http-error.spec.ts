import { HttpError } from './http-error'

test('HttpError === HttpError', () => {
    expect(HttpError.is(HttpError.badGateway())).toBe(true)
})
