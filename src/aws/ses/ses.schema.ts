import { SesSchema } from '@aws-lambda-powertools/parser/schemas'

export const sesSchema = SesSchema
export const sesRecordSchema = sesSchema.shape.Records.element
export const sesMessage = sesRecordSchema.shape.ses
export const sesMail = sesMessage.shape.mail
export const sesReceipt = sesMessage.shape.receipt
export const sesReceiptVerdict = sesReceipt.shape.dkimVerdict
