/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"S3EventRecord","type":"object","properties":{"eventVersion":{"type":"string"},"eventSource":{"type":"string"},"awsRegion":{"type":"string"},"eventTime":{"type":"string"},"eventName":{"type":"string"},"userIdentity":{"type":"object","properties":{"principalId":{"type":"string"}},"required":["principalId"],"additionalProperties":true},"requestParameters":{"type":"object","properties":{"sourceIPAddress":{"type":"string"}},"required":["sourceIPAddress"],"additionalProperties":true},"responseElements":{"type":"object","properties":{"x-amz-request-id":{"type":"string"},"x-amz-id-2":{"type":"string"}},"required":["x-amz-id-2","x-amz-request-id"],"additionalProperties":true},"s3":{"type":"object","properties":{"s3SchemaVersion":{"type":"string"},"configurationId":{"type":"string"},"bucket":{"type":"object","properties":{"name":{"type":"string"},"ownerIdentity":{"type":"object","properties":{"principalId":{"type":"string"}},"required":["principalId"],"additionalProperties":true},"arn":{"type":"string"}},"required":["arn","name","ownerIdentity"],"additionalProperties":true},"object":{"type":"object","properties":{"key":{"type":"string"},"size":{"type":"integer"},"eTag":{"type":"string"},"versionId":{"type":"string"},"sequencer":{"type":"string"}},"required":["eTag","key","sequencer","size"],"additionalProperties":true}},"required":["bucket","configurationId","object","s3SchemaVersion"],"additionalProperties":true},"glacierEventData":{"type":"object","properties":{"restoreEventData":{"type":"object","properties":{"lifecycleRestorationExpiryTime":{"type":"string"},"lifecycleRestoreStorageClass":{"type":"string"}},"required":["lifecycleRestorationExpiryTime","lifecycleRestoreStorageClass"],"additionalProperties":true}},"required":["restoreEventData"],"additionalProperties":true}},"required":["awsRegion","eventName","eventSource","eventTime","eventVersion","requestParameters","responseElements","s3","userIdentity"],"additionalProperties":true};function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;let valid0 = true;for( missing0 of schema11.required){valid0 = data[missing0] !== undefined;if(!valid0){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;break;}}if(valid0){if(data.eventVersion !== undefined){const _errs2 = errors;if(typeof data.eventVersion !== "string"){validate10.errors = [{instancePath:instancePath+"/eventVersion",schemaPath:"#/properties/eventVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs2 === errors;}else {var valid1 = true;}if(valid1){if(data.eventSource !== undefined){const _errs4 = errors;if(typeof data.eventSource !== "string"){validate10.errors = [{instancePath:instancePath+"/eventSource",schemaPath:"#/properties/eventSource/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs4 === errors;}else {var valid1 = true;}if(valid1){if(data.awsRegion !== undefined){const _errs6 = errors;if(typeof data.awsRegion !== "string"){validate10.errors = [{instancePath:instancePath+"/awsRegion",schemaPath:"#/properties/awsRegion/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs6 === errors;}else {var valid1 = true;}if(valid1){if(data.eventTime !== undefined){const _errs8 = errors;if(typeof data.eventTime !== "string"){validate10.errors = [{instancePath:instancePath+"/eventTime",schemaPath:"#/properties/eventTime/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs8 === errors;}else {var valid1 = true;}if(valid1){if(data.eventName !== undefined){const _errs10 = errors;if(typeof data.eventName !== "string"){validate10.errors = [{instancePath:instancePath+"/eventName",schemaPath:"#/properties/eventName/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs10 === errors;}else {var valid1 = true;}if(valid1){if(data.userIdentity !== undefined){let data5 = data.userIdentity;const _errs12 = errors;if(errors === _errs12){if(data5 && typeof data5 == "object" && !Array.isArray(data5)){let missing1;if((data5.principalId === undefined) && (missing1 = "principalId")){validate10.errors = [{instancePath:instancePath+"/userIdentity",schemaPath:"#/properties/userIdentity/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];return false;}else {if(data5.principalId !== undefined){if(typeof data5.principalId !== "string"){validate10.errors = [{instancePath:instancePath+"/userIdentity/principalId",schemaPath:"#/properties/userIdentity/properties/principalId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}}else {validate10.errors = [{instancePath:instancePath+"/userIdentity",schemaPath:"#/properties/userIdentity/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs12 === errors;}else {var valid1 = true;}if(valid1){if(data.requestParameters !== undefined){let data7 = data.requestParameters;const _errs17 = errors;if(errors === _errs17){if(data7 && typeof data7 == "object" && !Array.isArray(data7)){let missing2;if((data7.sourceIPAddress === undefined) && (missing2 = "sourceIPAddress")){validate10.errors = [{instancePath:instancePath+"/requestParameters",schemaPath:"#/properties/requestParameters/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];return false;}else {if(data7.sourceIPAddress !== undefined){if(typeof data7.sourceIPAddress !== "string"){validate10.errors = [{instancePath:instancePath+"/requestParameters/sourceIPAddress",schemaPath:"#/properties/requestParameters/properties/sourceIPAddress/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}}else {validate10.errors = [{instancePath:instancePath+"/requestParameters",schemaPath:"#/properties/requestParameters/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs17 === errors;}else {var valid1 = true;}if(valid1){if(data.responseElements !== undefined){let data9 = data.responseElements;const _errs22 = errors;if(errors === _errs22){if(data9 && typeof data9 == "object" && !Array.isArray(data9)){let missing3;if(((data9["x-amz-id-2"] === undefined) && (missing3 = "x-amz-id-2")) || ((data9["x-amz-request-id"] === undefined) && (missing3 = "x-amz-request-id"))){validate10.errors = [{instancePath:instancePath+"/responseElements",schemaPath:"#/properties/responseElements/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"}];return false;}else {if(data9["x-amz-request-id"] !== undefined){const _errs25 = errors;if(typeof data9["x-amz-request-id"] !== "string"){validate10.errors = [{instancePath:instancePath+"/responseElements/x-amz-request-id",schemaPath:"#/properties/responseElements/properties/x-amz-request-id/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs25 === errors;}else {var valid4 = true;}if(valid4){if(data9["x-amz-id-2"] !== undefined){const _errs27 = errors;if(typeof data9["x-amz-id-2"] !== "string"){validate10.errors = [{instancePath:instancePath+"/responseElements/x-amz-id-2",schemaPath:"#/properties/responseElements/properties/x-amz-id-2/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs27 === errors;}else {var valid4 = true;}}}}else {validate10.errors = [{instancePath:instancePath+"/responseElements",schemaPath:"#/properties/responseElements/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs22 === errors;}else {var valid1 = true;}if(valid1){if(data.s3 !== undefined){let data12 = data.s3;const _errs29 = errors;if(errors === _errs29){if(data12 && typeof data12 == "object" && !Array.isArray(data12)){let missing4;if(((((data12.bucket === undefined) && (missing4 = "bucket")) || ((data12.configurationId === undefined) && (missing4 = "configurationId"))) || ((data12.object === undefined) && (missing4 = "object"))) || ((data12.s3SchemaVersion === undefined) && (missing4 = "s3SchemaVersion"))){validate10.errors = [{instancePath:instancePath+"/s3",schemaPath:"#/properties/s3/required",keyword:"required",params:{missingProperty: missing4},message:"must have required property '"+missing4+"'"}];return false;}else {if(data12.s3SchemaVersion !== undefined){const _errs32 = errors;if(typeof data12.s3SchemaVersion !== "string"){validate10.errors = [{instancePath:instancePath+"/s3/s3SchemaVersion",schemaPath:"#/properties/s3/properties/s3SchemaVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid5 = _errs32 === errors;}else {var valid5 = true;}if(valid5){if(data12.configurationId !== undefined){const _errs34 = errors;if(typeof data12.configurationId !== "string"){validate10.errors = [{instancePath:instancePath+"/s3/configurationId",schemaPath:"#/properties/s3/properties/configurationId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid5 = _errs34 === errors;}else {var valid5 = true;}if(valid5){if(data12.bucket !== undefined){let data15 = data12.bucket;const _errs36 = errors;if(errors === _errs36){if(data15 && typeof data15 == "object" && !Array.isArray(data15)){let missing5;if((((data15.arn === undefined) && (missing5 = "arn")) || ((data15.name === undefined) && (missing5 = "name"))) || ((data15.ownerIdentity === undefined) && (missing5 = "ownerIdentity"))){validate10.errors = [{instancePath:instancePath+"/s3/bucket",schemaPath:"#/properties/s3/properties/bucket/required",keyword:"required",params:{missingProperty: missing5},message:"must have required property '"+missing5+"'"}];return false;}else {if(data15.name !== undefined){const _errs39 = errors;if(typeof data15.name !== "string"){validate10.errors = [{instancePath:instancePath+"/s3/bucket/name",schemaPath:"#/properties/s3/properties/bucket/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid6 = _errs39 === errors;}else {var valid6 = true;}if(valid6){if(data15.ownerIdentity !== undefined){let data17 = data15.ownerIdentity;const _errs41 = errors;if(errors === _errs41){if(data17 && typeof data17 == "object" && !Array.isArray(data17)){let missing6;if((data17.principalId === undefined) && (missing6 = "principalId")){validate10.errors = [{instancePath:instancePath+"/s3/bucket/ownerIdentity",schemaPath:"#/properties/s3/properties/bucket/properties/ownerIdentity/required",keyword:"required",params:{missingProperty: missing6},message:"must have required property '"+missing6+"'"}];return false;}else {if(data17.principalId !== undefined){if(typeof data17.principalId !== "string"){validate10.errors = [{instancePath:instancePath+"/s3/bucket/ownerIdentity/principalId",schemaPath:"#/properties/s3/properties/bucket/properties/ownerIdentity/properties/principalId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}}else {validate10.errors = [{instancePath:instancePath+"/s3/bucket/ownerIdentity",schemaPath:"#/properties/s3/properties/bucket/properties/ownerIdentity/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid6 = _errs41 === errors;}else {var valid6 = true;}if(valid6){if(data15.arn !== undefined){const _errs46 = errors;if(typeof data15.arn !== "string"){validate10.errors = [{instancePath:instancePath+"/s3/bucket/arn",schemaPath:"#/properties/s3/properties/bucket/properties/arn/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid6 = _errs46 === errors;}else {var valid6 = true;}}}}}else {validate10.errors = [{instancePath:instancePath+"/s3/bucket",schemaPath:"#/properties/s3/properties/bucket/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid5 = _errs36 === errors;}else {var valid5 = true;}if(valid5){if(data12.object !== undefined){let data20 = data12.object;const _errs48 = errors;if(errors === _errs48){if(data20 && typeof data20 == "object" && !Array.isArray(data20)){let missing7;if(((((data20.eTag === undefined) && (missing7 = "eTag")) || ((data20.key === undefined) && (missing7 = "key"))) || ((data20.sequencer === undefined) && (missing7 = "sequencer"))) || ((data20.size === undefined) && (missing7 = "size"))){validate10.errors = [{instancePath:instancePath+"/s3/object",schemaPath:"#/properties/s3/properties/object/required",keyword:"required",params:{missingProperty: missing7},message:"must have required property '"+missing7+"'"}];return false;}else {if(data20.key !== undefined){const _errs51 = errors;if(typeof data20.key !== "string"){validate10.errors = [{instancePath:instancePath+"/s3/object/key",schemaPath:"#/properties/s3/properties/object/properties/key/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid8 = _errs51 === errors;}else {var valid8 = true;}if(valid8){if(data20.size !== undefined){let data22 = data20.size;const _errs53 = errors;if(!(((typeof data22 == "number") && (!(data22 % 1) && !isNaN(data22))) && (isFinite(data22)))){validate10.errors = [{instancePath:instancePath+"/s3/object/size",schemaPath:"#/properties/s3/properties/object/properties/size/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];return false;}var valid8 = _errs53 === errors;}else {var valid8 = true;}if(valid8){if(data20.eTag !== undefined){const _errs55 = errors;if(typeof data20.eTag !== "string"){validate10.errors = [{instancePath:instancePath+"/s3/object/eTag",schemaPath:"#/properties/s3/properties/object/properties/eTag/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid8 = _errs55 === errors;}else {var valid8 = true;}if(valid8){if(data20.versionId !== undefined){const _errs57 = errors;if(typeof data20.versionId !== "string"){validate10.errors = [{instancePath:instancePath+"/s3/object/versionId",schemaPath:"#/properties/s3/properties/object/properties/versionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid8 = _errs57 === errors;}else {var valid8 = true;}if(valid8){if(data20.sequencer !== undefined){const _errs59 = errors;if(typeof data20.sequencer !== "string"){validate10.errors = [{instancePath:instancePath+"/s3/object/sequencer",schemaPath:"#/properties/s3/properties/object/properties/sequencer/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid8 = _errs59 === errors;}else {var valid8 = true;}}}}}}}else {validate10.errors = [{instancePath:instancePath+"/s3/object",schemaPath:"#/properties/s3/properties/object/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid5 = _errs48 === errors;}else {var valid5 = true;}}}}}}else {validate10.errors = [{instancePath:instancePath+"/s3",schemaPath:"#/properties/s3/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs29 === errors;}else {var valid1 = true;}if(valid1){if(data.glacierEventData !== undefined){let data26 = data.glacierEventData;const _errs61 = errors;if(errors === _errs61){if(data26 && typeof data26 == "object" && !Array.isArray(data26)){let missing8;if((data26.restoreEventData === undefined) && (missing8 = "restoreEventData")){validate10.errors = [{instancePath:instancePath+"/glacierEventData",schemaPath:"#/properties/glacierEventData/required",keyword:"required",params:{missingProperty: missing8},message:"must have required property '"+missing8+"'"}];return false;}else {if(data26.restoreEventData !== undefined){let data27 = data26.restoreEventData;const _errs64 = errors;if(errors === _errs64){if(data27 && typeof data27 == "object" && !Array.isArray(data27)){let missing9;if(((data27.lifecycleRestorationExpiryTime === undefined) && (missing9 = "lifecycleRestorationExpiryTime")) || ((data27.lifecycleRestoreStorageClass === undefined) && (missing9 = "lifecycleRestoreStorageClass"))){validate10.errors = [{instancePath:instancePath+"/glacierEventData/restoreEventData",schemaPath:"#/properties/glacierEventData/properties/restoreEventData/required",keyword:"required",params:{missingProperty: missing9},message:"must have required property '"+missing9+"'"}];return false;}else {if(data27.lifecycleRestorationExpiryTime !== undefined){const _errs67 = errors;if(typeof data27.lifecycleRestorationExpiryTime !== "string"){validate10.errors = [{instancePath:instancePath+"/glacierEventData/restoreEventData/lifecycleRestorationExpiryTime",schemaPath:"#/properties/glacierEventData/properties/restoreEventData/properties/lifecycleRestorationExpiryTime/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid10 = _errs67 === errors;}else {var valid10 = true;}if(valid10){if(data27.lifecycleRestoreStorageClass !== undefined){const _errs69 = errors;if(typeof data27.lifecycleRestoreStorageClass !== "string"){validate10.errors = [{instancePath:instancePath+"/glacierEventData/restoreEventData/lifecycleRestoreStorageClass",schemaPath:"#/properties/glacierEventData/properties/restoreEventData/properties/lifecycleRestoreStorageClass/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid10 = _errs69 === errors;}else {var valid10 = true;}}}}else {validate10.errors = [{instancePath:instancePath+"/glacierEventData/restoreEventData",schemaPath:"#/properties/glacierEventData/properties/restoreEventData/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}}}}else {validate10.errors = [{instancePath:instancePath+"/glacierEventData",schemaPath:"#/properties/glacierEventData/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs61 === errors;}else {var valid1 = true;}}}}}}}}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;