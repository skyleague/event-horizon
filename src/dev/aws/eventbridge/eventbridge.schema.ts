import { EventBridgeSchema } from '@aws-lambda-powertools/parser/schemas'
import { $ref } from '@skyleague/therefore'

export const eventBridgeSchema = $ref(EventBridgeSchema).validator()
