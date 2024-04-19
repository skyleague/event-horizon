/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"S3Event","type":"object","properties":{"Records":{"type":"array","items":{"$ref":"#/$defs/S3EventRecord"}}},"required":["Records"],"additionalProperties":true,"$defs":{"S3EventRecord":{"type":"object","properties":{"eventVersion":{"type":"string"},"eventSource":{"type":"string"},"awsRegion":{"type":"string"},"eventTime":{"type":"string"},"eventName":{"type":"string"},"userIdentity":{"type":"object","properties":{"principalId":{"type":"string"}},"required":["principalId"],"additionalProperties":true},"requestParameters":{"type":"object","properties":{"sourceIPAddress":{"type":"string"}},"required":["sourceIPAddress"],"additionalProperties":true},"responseElements":{"type":"object","properties":{"x-amz-request-id":{"type":"string"},"x-amz-id-2":{"type":"string"}},"required":["x-amz-id-2","x-amz-request-id"],"additionalProperties":true},"s3":{"type":"object","properties":{"s3SchemaVersion":{"type":"string"},"configurationId":{"type":"string"},"bucket":{"type":"object","properties":{"name":{"type":"string"},"ownerIdentity":{"type":"object","properties":{"principalId":{"type":"string"}},"required":["principalId"],"additionalProperties":true},"arn":{"type":"string"}},"required":["arn","name","ownerIdentity"],"additionalProperties":true},"object":{"type":"object","properties":{"key":{"type":"string"},"size":{"type":"integer"},"eTag":{"type":"string"},"versionId":{"type":"string"},"sequencer":{"type":"string"}},"required":["eTag","key","sequencer","size"],"additionalProperties":true}},"required":["bucket","configurationId","object","s3SchemaVersion"],"additionalProperties":true},"glacierEventData":{"type":"object","properties":{"restoreEventData":{"type":"object","properties":{"lifecycleRestorationExpiryTime":{"type":"string"},"lifecycleRestoreStorageClass":{"type":"string"}},"required":["lifecycleRestorationExpiryTime","lifecycleRestoreStorageClass"],"additionalProperties":true}},"required":["restoreEventData"],"additionalProperties":true}},"required":["awsRegion","eventName","eventSource","eventTime","eventVersion","requestParameters","responseElements","s3","userIdentity"],"additionalProperties":true}}};const schema12 = {"type":"object","properties":{"eventVersion":{"type":"string"},"eventSource":{"type":"string"},"awsRegion":{"type":"string"},"eventTime":{"type":"string"},"eventName":{"type":"string"},"userIdentity":{"type":"object","properties":{"principalId":{"type":"string"}},"required":["principalId"],"additionalProperties":true},"requestParameters":{"type":"object","properties":{"sourceIPAddress":{"type":"string"}},"required":["sourceIPAddress"],"additionalProperties":true},"responseElements":{"type":"object","properties":{"x-amz-request-id":{"type":"string"},"x-amz-id-2":{"type":"string"}},"required":["x-amz-id-2","x-amz-request-id"],"additionalProperties":true},"s3":{"type":"object","properties":{"s3SchemaVersion":{"type":"string"},"configurationId":{"type":"string"},"bucket":{"type":"object","properties":{"name":{"type":"string"},"ownerIdentity":{"type":"object","properties":{"principalId":{"type":"string"}},"required":["principalId"],"additionalProperties":true},"arn":{"type":"string"}},"required":["arn","name","ownerIdentity"],"additionalProperties":true},"object":{"type":"object","properties":{"key":{"type":"string"},"size":{"type":"integer"},"eTag":{"type":"string"},"versionId":{"type":"string"},"sequencer":{"type":"string"}},"required":["eTag","key","sequencer","size"],"additionalProperties":true}},"required":["bucket","configurationId","object","s3SchemaVersion"],"additionalProperties":true},"glacierEventData":{"type":"object","properties":{"restoreEventData":{"type":"object","properties":{"lifecycleRestorationExpiryTime":{"type":"string"},"lifecycleRestoreStorageClass":{"type":"string"}},"required":["lifecycleRestorationExpiryTime","lifecycleRestoreStorageClass"],"additionalProperties":true}},"required":["restoreEventData"],"additionalProperties":true}},"required":["awsRegion","eventName","eventSource","eventTime","eventVersion","requestParameters","responseElements","s3","userIdentity"],"additionalProperties":true};function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((data.Records === undefined) && (missing0 = "Records")){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.Records !== undefined){let data0 = data.Records;const _errs2 = errors;if(errors === _errs2){if(Array.isArray(data0)){var valid1 = true;const len0 = data0.length;for(let i0=0; i0<len0; i0++){let data1 = data0[i0];const _errs4 = errors;const _errs5 = errors;if(errors === _errs5){if(data1 && typeof data1 == "object" && !Array.isArray(data1)){let missing1;let valid3 = true;for( missing1 of schema12.required){valid3 = data1[missing1] !== undefined;if(!valid3){validate10.errors = [{instancePath:instancePath+"/Records/" + i0,schemaPath:"#/$defs/S3EventRecord/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];return false;break;}}if(valid3){if(data1.eventVersion !== undefined){const _errs8 = errors;if(typeof data1.eventVersion !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/eventVersion",schemaPath:"#/$defs/S3EventRecord/properties/eventVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs8 === errors;}else {var valid4 = true;}if(valid4){if(data1.eventSource !== undefined){const _errs10 = errors;if(typeof data1.eventSource !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/eventSource",schemaPath:"#/$defs/S3EventRecord/properties/eventSource/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs10 === errors;}else {var valid4 = true;}if(valid4){if(data1.awsRegion !== undefined){const _errs12 = errors;if(typeof data1.awsRegion !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/awsRegion",schemaPath:"#/$defs/S3EventRecord/properties/awsRegion/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs12 === errors;}else {var valid4 = true;}if(valid4){if(data1.eventTime !== undefined){const _errs14 = errors;if(typeof data1.eventTime !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/eventTime",schemaPath:"#/$defs/S3EventRecord/properties/eventTime/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs14 === errors;}else {var valid4 = true;}if(valid4){if(data1.eventName !== undefined){const _errs16 = errors;if(typeof data1.eventName !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/eventName",schemaPath:"#/$defs/S3EventRecord/properties/eventName/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs16 === errors;}else {var valid4 = true;}if(valid4){if(data1.userIdentity !== undefined){let data7 = data1.userIdentity;const _errs18 = errors;if(errors === _errs18){if(data7 && typeof data7 == "object" && !Array.isArray(data7)){let missing2;if((data7.principalId === undefined) && (missing2 = "principalId")){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/userIdentity",schemaPath:"#/$defs/S3EventRecord/properties/userIdentity/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];return false;}else {if(data7.principalId !== undefined){if(typeof data7.principalId !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/userIdentity/principalId",schemaPath:"#/$defs/S3EventRecord/properties/userIdentity/properties/principalId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/userIdentity",schemaPath:"#/$defs/S3EventRecord/properties/userIdentity/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid4 = _errs18 === errors;}else {var valid4 = true;}if(valid4){if(data1.requestParameters !== undefined){let data9 = data1.requestParameters;const _errs23 = errors;if(errors === _errs23){if(data9 && typeof data9 == "object" && !Array.isArray(data9)){let missing3;if((data9.sourceIPAddress === undefined) && (missing3 = "sourceIPAddress")){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/requestParameters",schemaPath:"#/$defs/S3EventRecord/properties/requestParameters/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"}];return false;}else {if(data9.sourceIPAddress !== undefined){if(typeof data9.sourceIPAddress !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/requestParameters/sourceIPAddress",schemaPath:"#/$defs/S3EventRecord/properties/requestParameters/properties/sourceIPAddress/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/requestParameters",schemaPath:"#/$defs/S3EventRecord/properties/requestParameters/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid4 = _errs23 === errors;}else {var valid4 = true;}if(valid4){if(data1.responseElements !== undefined){let data11 = data1.responseElements;const _errs28 = errors;if(errors === _errs28){if(data11 && typeof data11 == "object" && !Array.isArray(data11)){let missing4;if(((data11["x-amz-id-2"] === undefined) && (missing4 = "x-amz-id-2")) || ((data11["x-amz-request-id"] === undefined) && (missing4 = "x-amz-request-id"))){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/responseElements",schemaPath:"#/$defs/S3EventRecord/properties/responseElements/required",keyword:"required",params:{missingProperty: missing4},message:"must have required property '"+missing4+"'"}];return false;}else {if(data11["x-amz-request-id"] !== undefined){const _errs31 = errors;if(typeof data11["x-amz-request-id"] !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/responseElements/x-amz-request-id",schemaPath:"#/$defs/S3EventRecord/properties/responseElements/properties/x-amz-request-id/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid7 = _errs31 === errors;}else {var valid7 = true;}if(valid7){if(data11["x-amz-id-2"] !== undefined){const _errs33 = errors;if(typeof data11["x-amz-id-2"] !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/responseElements/x-amz-id-2",schemaPath:"#/$defs/S3EventRecord/properties/responseElements/properties/x-amz-id-2/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid7 = _errs33 === errors;}else {var valid7 = true;}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/responseElements",schemaPath:"#/$defs/S3EventRecord/properties/responseElements/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid4 = _errs28 === errors;}else {var valid4 = true;}if(valid4){if(data1.s3 !== undefined){let data14 = data1.s3;const _errs35 = errors;if(errors === _errs35){if(data14 && typeof data14 == "object" && !Array.isArray(data14)){let missing5;if(((((data14.bucket === undefined) && (missing5 = "bucket")) || ((data14.configurationId === undefined) && (missing5 = "configurationId"))) || ((data14.object === undefined) && (missing5 = "object"))) || ((data14.s3SchemaVersion === undefined) && (missing5 = "s3SchemaVersion"))){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3",schemaPath:"#/$defs/S3EventRecord/properties/s3/required",keyword:"required",params:{missingProperty: missing5},message:"must have required property '"+missing5+"'"}];return false;}else {if(data14.s3SchemaVersion !== undefined){const _errs38 = errors;if(typeof data14.s3SchemaVersion !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3/s3SchemaVersion",schemaPath:"#/$defs/S3EventRecord/properties/s3/properties/s3SchemaVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid8 = _errs38 === errors;}else {var valid8 = true;}if(valid8){if(data14.configurationId !== undefined){const _errs40 = errors;if(typeof data14.configurationId !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3/configurationId",schemaPath:"#/$defs/S3EventRecord/properties/s3/properties/configurationId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid8 = _errs40 === errors;}else {var valid8 = true;}if(valid8){if(data14.bucket !== undefined){let data17 = data14.bucket;const _errs42 = errors;if(errors === _errs42){if(data17 && typeof data17 == "object" && !Array.isArray(data17)){let missing6;if((((data17.arn === undefined) && (missing6 = "arn")) || ((data17.name === undefined) && (missing6 = "name"))) || ((data17.ownerIdentity === undefined) && (missing6 = "ownerIdentity"))){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3/bucket",schemaPath:"#/$defs/S3EventRecord/properties/s3/properties/bucket/required",keyword:"required",params:{missingProperty: missing6},message:"must have required property '"+missing6+"'"}];return false;}else {if(data17.name !== undefined){const _errs45 = errors;if(typeof data17.name !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3/bucket/name",schemaPath:"#/$defs/S3EventRecord/properties/s3/properties/bucket/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid9 = _errs45 === errors;}else {var valid9 = true;}if(valid9){if(data17.ownerIdentity !== undefined){let data19 = data17.ownerIdentity;const _errs47 = errors;if(errors === _errs47){if(data19 && typeof data19 == "object" && !Array.isArray(data19)){let missing7;if((data19.principalId === undefined) && (missing7 = "principalId")){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3/bucket/ownerIdentity",schemaPath:"#/$defs/S3EventRecord/properties/s3/properties/bucket/properties/ownerIdentity/required",keyword:"required",params:{missingProperty: missing7},message:"must have required property '"+missing7+"'"}];return false;}else {if(data19.principalId !== undefined){if(typeof data19.principalId !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3/bucket/ownerIdentity/principalId",schemaPath:"#/$defs/S3EventRecord/properties/s3/properties/bucket/properties/ownerIdentity/properties/principalId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3/bucket/ownerIdentity",schemaPath:"#/$defs/S3EventRecord/properties/s3/properties/bucket/properties/ownerIdentity/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid9 = _errs47 === errors;}else {var valid9 = true;}if(valid9){if(data17.arn !== undefined){const _errs52 = errors;if(typeof data17.arn !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3/bucket/arn",schemaPath:"#/$defs/S3EventRecord/properties/s3/properties/bucket/properties/arn/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid9 = _errs52 === errors;}else {var valid9 = true;}}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3/bucket",schemaPath:"#/$defs/S3EventRecord/properties/s3/properties/bucket/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid8 = _errs42 === errors;}else {var valid8 = true;}if(valid8){if(data14.object !== undefined){let data22 = data14.object;const _errs54 = errors;if(errors === _errs54){if(data22 && typeof data22 == "object" && !Array.isArray(data22)){let missing8;if(((((data22.eTag === undefined) && (missing8 = "eTag")) || ((data22.key === undefined) && (missing8 = "key"))) || ((data22.sequencer === undefined) && (missing8 = "sequencer"))) || ((data22.size === undefined) && (missing8 = "size"))){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3/object",schemaPath:"#/$defs/S3EventRecord/properties/s3/properties/object/required",keyword:"required",params:{missingProperty: missing8},message:"must have required property '"+missing8+"'"}];return false;}else {if(data22.key !== undefined){const _errs57 = errors;if(typeof data22.key !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3/object/key",schemaPath:"#/$defs/S3EventRecord/properties/s3/properties/object/properties/key/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid11 = _errs57 === errors;}else {var valid11 = true;}if(valid11){if(data22.size !== undefined){let data24 = data22.size;const _errs59 = errors;if(!(((typeof data24 == "number") && (!(data24 % 1) && !isNaN(data24))) && (isFinite(data24)))){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3/object/size",schemaPath:"#/$defs/S3EventRecord/properties/s3/properties/object/properties/size/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];return false;}var valid11 = _errs59 === errors;}else {var valid11 = true;}if(valid11){if(data22.eTag !== undefined){const _errs61 = errors;if(typeof data22.eTag !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3/object/eTag",schemaPath:"#/$defs/S3EventRecord/properties/s3/properties/object/properties/eTag/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid11 = _errs61 === errors;}else {var valid11 = true;}if(valid11){if(data22.versionId !== undefined){const _errs63 = errors;if(typeof data22.versionId !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3/object/versionId",schemaPath:"#/$defs/S3EventRecord/properties/s3/properties/object/properties/versionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid11 = _errs63 === errors;}else {var valid11 = true;}if(valid11){if(data22.sequencer !== undefined){const _errs65 = errors;if(typeof data22.sequencer !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3/object/sequencer",schemaPath:"#/$defs/S3EventRecord/properties/s3/properties/object/properties/sequencer/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid11 = _errs65 === errors;}else {var valid11 = true;}}}}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3/object",schemaPath:"#/$defs/S3EventRecord/properties/s3/properties/object/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid8 = _errs54 === errors;}else {var valid8 = true;}}}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/s3",schemaPath:"#/$defs/S3EventRecord/properties/s3/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid4 = _errs35 === errors;}else {var valid4 = true;}if(valid4){if(data1.glacierEventData !== undefined){let data28 = data1.glacierEventData;const _errs67 = errors;if(errors === _errs67){if(data28 && typeof data28 == "object" && !Array.isArray(data28)){let missing9;if((data28.restoreEventData === undefined) && (missing9 = "restoreEventData")){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/glacierEventData",schemaPath:"#/$defs/S3EventRecord/properties/glacierEventData/required",keyword:"required",params:{missingProperty: missing9},message:"must have required property '"+missing9+"'"}];return false;}else {if(data28.restoreEventData !== undefined){let data29 = data28.restoreEventData;const _errs70 = errors;if(errors === _errs70){if(data29 && typeof data29 == "object" && !Array.isArray(data29)){let missing10;if(((data29.lifecycleRestorationExpiryTime === undefined) && (missing10 = "lifecycleRestorationExpiryTime")) || ((data29.lifecycleRestoreStorageClass === undefined) && (missing10 = "lifecycleRestoreStorageClass"))){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/glacierEventData/restoreEventData",schemaPath:"#/$defs/S3EventRecord/properties/glacierEventData/properties/restoreEventData/required",keyword:"required",params:{missingProperty: missing10},message:"must have required property '"+missing10+"'"}];return false;}else {if(data29.lifecycleRestorationExpiryTime !== undefined){const _errs73 = errors;if(typeof data29.lifecycleRestorationExpiryTime !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/glacierEventData/restoreEventData/lifecycleRestorationExpiryTime",schemaPath:"#/$defs/S3EventRecord/properties/glacierEventData/properties/restoreEventData/properties/lifecycleRestorationExpiryTime/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid13 = _errs73 === errors;}else {var valid13 = true;}if(valid13){if(data29.lifecycleRestoreStorageClass !== undefined){const _errs75 = errors;if(typeof data29.lifecycleRestoreStorageClass !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/glacierEventData/restoreEventData/lifecycleRestoreStorageClass",schemaPath:"#/$defs/S3EventRecord/properties/glacierEventData/properties/restoreEventData/properties/lifecycleRestoreStorageClass/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid13 = _errs75 === errors;}else {var valid13 = true;}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/glacierEventData/restoreEventData",schemaPath:"#/$defs/S3EventRecord/properties/glacierEventData/properties/restoreEventData/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/glacierEventData",schemaPath:"#/$defs/S3EventRecord/properties/glacierEventData/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid4 = _errs67 === errors;}else {var valid4 = true;}}}}}}}}}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0,schemaPath:"#/$defs/S3EventRecord/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs4 === errors;if(!valid1){break;}}}else {validate10.errors = [{instancePath:instancePath+"/Records",schemaPath:"#/properties/Records/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;