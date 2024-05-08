import { SesSchema } from '@aws-lambda-powertools/parser/schemas'
import { $ref } from '@skyleague/therefore'

export const sesSchema = $ref(SesSchema).validator()
export const sesRecordSchema = sesSchema.shape.Records.element.validator()
export const sesMessage = sesRecordSchema.shape.ses
export const sesMail = sesMessage.shape.mail
export const sesReceipt = sesMessage.shape.receipt
export const sesReceiptVerdict = sesReceipt.shape.dkimVerdict
