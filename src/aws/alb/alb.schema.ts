import { AlbMultiValueHeadersSchema, AlbSchema } from '@aws-lambda-powertools/parser/schemas'
import { $ref } from '@skyleague/therefore'

export const albSchema = $ref(AlbSchema)
export const albMultiValueHeadersSchema = $ref(AlbMultiValueHeadersSchema)
