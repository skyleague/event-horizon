import { S3Schema } from '@aws-lambda-powertools/parser/schemas'
import { $ref } from '@skyleague/therefore'

export const s3Schema = $ref(S3Schema).validator()
export const s3RecordSchema = s3Schema.shape.Records.element.validator()
export const s3Message = s3RecordSchema.shape.s3
export const s3Identity = s3RecordSchema.shape.userIdentity
export const s3RequestParameters = s3RecordSchema.shape.requestParameters
export const s3ResponseElements = s3RecordSchema.shape.responseElements
export const s3EventRecordGlacierEventData = s3RecordSchema.shape.glacierEventData.unwrap()

// export const s3EventNotificationEventBridgeSchema = S3EventNotificationEventBridgeSchema
// export const s3EventNotificationEventBridgeDetailSchema = s3EventNotificationEventBridgeSchema.shape.detail

// export const s3SqsEventNotificationSchema = $ref(S3SqsEventNotificationSchema).validator()
// export const s3SqsEventNotificationRecordSchema = s3SqsEventNotificationSchema.shape.Records.element

// export const s3ObjectLambdaEventSchema = $ref(S3ObjectLambdaEventSchema).validator()
// export const s3ObjectContext = s3ObjectLambdaEventSchema.shape.getObjectContext
// export const s3ObjectConfiguration = s3ObjectLambdaEventSchema.shape.configuration
// export const s3ObjectUserRequest = s3ObjectLambdaEventSchema.shape.userRequest
// export const s3ObjectUserIdentity = s3ObjectLambdaEventSchema.shape.userIdentity
// export const s3ObjectSessionContext = s3ObjectUserIdentity.shape.sessionContext
