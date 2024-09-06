import { $integer, $object, $string } from '@skyleague/therefore'

export const httpError = $object({
    statusCode: $integer().describe('The status code of the response.'),
    message: $string().describe('A detailed message of the error.'),
})
    .describe('The default error error response for both 400 & 500 type errors')
    .validator()
