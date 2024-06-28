/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
import { fullFormats as ajvFormatsDistFormatsFullFormats } from 'ajv-formats/dist/formats.js';
"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"S3Schema","type":"object","properties":{"Records":{"type":"array","items":{"type":"object","properties":{"eventVersion":{"type":"string"},"eventSource":{"const":"aws:s3"},"awsRegion":{"type":"string"},"eventTime":{"type":"string","format":"date-time"},"eventName":{"type":"string"},"userIdentity":{"$ref":"#/$defs/S3Identity"},"requestParameters":{"$ref":"#/$defs/S3RequestParameters"},"responseElements":{"$ref":"#/$defs/S3ResponseElements"},"s3":{"$ref":"#/$defs/S3Message"},"glacierEventData":{"$ref":"#/$defs/S3EventRecordGlacierEventData"}},"required":["awsRegion","eventName","eventSource","eventTime","eventVersion","requestParameters","responseElements","s3","userIdentity"],"additionalProperties":true}}},"required":["Records"],"additionalProperties":true,"$defs":{"S3Identity":{"type":"object","properties":{"principalId":{"type":"string"}},"required":["principalId"],"additionalProperties":true},"S3RequestParameters":{"type":"object","properties":{"sourceIPAddress":{"type":"string"}},"required":["sourceIPAddress"],"additionalProperties":true},"S3ResponseElements":{"type":"object","properties":{"x-amz-request-id":{"type":"string"},"x-amz-id-2":{"type":"string"}},"required":["x-amz-id-2","x-amz-request-id"],"additionalProperties":true},"S3Message":{"type":"object","properties":{"s3SchemaVersion":{"type":"string"},"configurationId":{"type":"string"},"object":{"type":"object","properties":{"key":{"type":"string"},"size":{"type":"number"},"urlDecodedKey":{"type":"string"},"eTag":{"type":"string"},"sequencer":{"type":"string"},"versionId":{"type":"string"}},"required":["key","sequencer"],"additionalProperties":true},"bucket":{"type":"object","properties":{"name":{"type":"string"},"ownerIdentity":{"$ref":"#/$defs/S3Identity"},"arn":{"type":"string"}},"required":["arn","name","ownerIdentity"],"additionalProperties":true}},"required":["bucket","configurationId","object","s3SchemaVersion"],"additionalProperties":true},"S3EventRecordGlacierEventData":{"type":"object","properties":{"restoreEventData":{"type":"object","properties":{"lifecycleRestorationExpiryTime":{"type":"string"},"lifecycleRestoreStorageClass":{"type":"string"}},"required":["lifecycleRestorationExpiryTime","lifecycleRestoreStorageClass"],"additionalProperties":true}},"required":["restoreEventData"],"additionalProperties":true}}};const schema12 = {"type":"object","properties":{"principalId":{"type":"string"}},"required":["principalId"],"additionalProperties":true};const schema13 = {"type":"object","properties":{"sourceIPAddress":{"type":"string"}},"required":["sourceIPAddress"],"additionalProperties":true};const schema14 = {"type":"object","properties":{"x-amz-request-id":{"type":"string"},"x-amz-id-2":{"type":"string"}},"required":["x-amz-id-2","x-amz-request-id"],"additionalProperties":true};const schema17 = {"type":"object","properties":{"restoreEventData":{"type":"object","properties":{"lifecycleRestorationExpiryTime":{"type":"string"},"lifecycleRestoreStorageClass":{"type":"string"}},"required":["lifecycleRestorationExpiryTime","lifecycleRestoreStorageClass"],"additionalProperties":true}},"required":["restoreEventData"],"additionalProperties":true};const formats0 = ajvFormatsDistFormatsFullFormats["date-time"];const schema15 = {"type":"object","properties":{"s3SchemaVersion":{"type":"string"},"configurationId":{"type":"string"},"object":{"type":"object","properties":{"key":{"type":"string"},"size":{"type":"number"},"urlDecodedKey":{"type":"string"},"eTag":{"type":"string"},"sequencer":{"type":"string"},"versionId":{"type":"string"}},"required":["key","sequencer"],"additionalProperties":true},"bucket":{"type":"object","properties":{"name":{"type":"string"},"ownerIdentity":{"$ref":"#/$defs/S3Identity"},"arn":{"type":"string"}},"required":["arn","name","ownerIdentity"],"additionalProperties":true}},"required":["bucket","configurationId","object","s3SchemaVersion"],"additionalProperties":true};function validate11(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if(((((data.bucket === undefined) && (missing0 = "bucket")) || ((data.configurationId === undefined) && (missing0 = "configurationId"))) || ((data.object === undefined) && (missing0 = "object"))) || ((data.s3SchemaVersion === undefined) && (missing0 = "s3SchemaVersion"))){validate11.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.s3SchemaVersion !== undefined){const _errs2 = errors;if(typeof data.s3SchemaVersion !== "string"){validate11.errors = [{instancePath:instancePath+"/s3SchemaVersion",schemaPath:"#/properties/s3SchemaVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.configurationId !== undefined){const _errs4 = errors;if(typeof data.configurationId !== "string"){validate11.errors = [{instancePath:instancePath+"/configurationId",schemaPath:"#/properties/configurationId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs4 === errors;}else {var valid0 = true;}if(valid0){if(data.object !== undefined){let data2 = data.object;const _errs6 = errors;if(errors === _errs6){if(data2 && typeof data2 == "object" && !Array.isArray(data2)){let missing1;if(((data2.key === undefined) && (missing1 = "key")) || ((data2.sequencer === undefined) && (missing1 = "sequencer"))){validate11.errors = [{instancePath:instancePath+"/object",schemaPath:"#/properties/object/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];return false;}else {if(data2.key !== undefined){const _errs9 = errors;if(typeof data2.key !== "string"){validate11.errors = [{instancePath:instancePath+"/object/key",schemaPath:"#/properties/object/properties/key/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs9 === errors;}else {var valid1 = true;}if(valid1){if(data2.size !== undefined){let data4 = data2.size;const _errs11 = errors;if(!((typeof data4 == "number") && (isFinite(data4)))){validate11.errors = [{instancePath:instancePath+"/object/size",schemaPath:"#/properties/object/properties/size/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid1 = _errs11 === errors;}else {var valid1 = true;}if(valid1){if(data2.urlDecodedKey !== undefined){const _errs13 = errors;if(typeof data2.urlDecodedKey !== "string"){validate11.errors = [{instancePath:instancePath+"/object/urlDecodedKey",schemaPath:"#/properties/object/properties/urlDecodedKey/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs13 === errors;}else {var valid1 = true;}if(valid1){if(data2.eTag !== undefined){const _errs15 = errors;if(typeof data2.eTag !== "string"){validate11.errors = [{instancePath:instancePath+"/object/eTag",schemaPath:"#/properties/object/properties/eTag/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs15 === errors;}else {var valid1 = true;}if(valid1){if(data2.sequencer !== undefined){const _errs17 = errors;if(typeof data2.sequencer !== "string"){validate11.errors = [{instancePath:instancePath+"/object/sequencer",schemaPath:"#/properties/object/properties/sequencer/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs17 === errors;}else {var valid1 = true;}if(valid1){if(data2.versionId !== undefined){const _errs19 = errors;if(typeof data2.versionId !== "string"){validate11.errors = [{instancePath:instancePath+"/object/versionId",schemaPath:"#/properties/object/properties/versionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs19 === errors;}else {var valid1 = true;}}}}}}}}else {validate11.errors = [{instancePath:instancePath+"/object",schemaPath:"#/properties/object/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid0 = _errs6 === errors;}else {var valid0 = true;}if(valid0){if(data.bucket !== undefined){let data9 = data.bucket;const _errs21 = errors;if(errors === _errs21){if(data9 && typeof data9 == "object" && !Array.isArray(data9)){let missing2;if((((data9.arn === undefined) && (missing2 = "arn")) || ((data9.name === undefined) && (missing2 = "name"))) || ((data9.ownerIdentity === undefined) && (missing2 = "ownerIdentity"))){validate11.errors = [{instancePath:instancePath+"/bucket",schemaPath:"#/properties/bucket/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];return false;}else {if(data9.name !== undefined){const _errs24 = errors;if(typeof data9.name !== "string"){validate11.errors = [{instancePath:instancePath+"/bucket/name",schemaPath:"#/properties/bucket/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid2 = _errs24 === errors;}else {var valid2 = true;}if(valid2){if(data9.ownerIdentity !== undefined){let data11 = data9.ownerIdentity;const _errs26 = errors;const _errs27 = errors;if(errors === _errs27){if(data11 && typeof data11 == "object" && !Array.isArray(data11)){let missing3;if((data11.principalId === undefined) && (missing3 = "principalId")){validate11.errors = [{instancePath:instancePath+"/bucket/ownerIdentity",schemaPath:"#/$defs/S3Identity/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"}];return false;}else {if(data11.principalId !== undefined){if(typeof data11.principalId !== "string"){validate11.errors = [{instancePath:instancePath+"/bucket/ownerIdentity/principalId",schemaPath:"#/$defs/S3Identity/properties/principalId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}}else {validate11.errors = [{instancePath:instancePath+"/bucket/ownerIdentity",schemaPath:"#/$defs/S3Identity/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid2 = _errs26 === errors;}else {var valid2 = true;}if(valid2){if(data9.arn !== undefined){const _errs32 = errors;if(typeof data9.arn !== "string"){validate11.errors = [{instancePath:instancePath+"/bucket/arn",schemaPath:"#/properties/bucket/properties/arn/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid2 = _errs32 === errors;}else {var valid2 = true;}}}}}else {validate11.errors = [{instancePath:instancePath+"/bucket",schemaPath:"#/properties/bucket/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid0 = _errs21 === errors;}else {var valid0 = true;}}}}}}else {validate11.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate11.errors = vErrors;return errors === 0;}function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((data.Records === undefined) && (missing0 = "Records")){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.Records !== undefined){let data0 = data.Records;const _errs2 = errors;if(errors === _errs2){if(Array.isArray(data0)){var valid1 = true;const len0 = data0.length;for(let i0=0; i0<len0; i0++){let data1 = data0[i0];const _errs4 = errors;if(errors === _errs4){if(data1 && typeof data1 == "object" && !Array.isArray(data1)){let missing1;let valid2 = true;for( missing1 of schema11.properties.Records.items.required){valid2 = data1[missing1] !== undefined;if(!valid2){validate10.errors = [{instancePath:instancePath+"/Records/" + i0,schemaPath:"#/properties/Records/items/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];return false;break;}}if(valid2){if(data1.eventVersion !== undefined){const _errs7 = errors;if(typeof data1.eventVersion !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/eventVersion",schemaPath:"#/properties/Records/items/properties/eventVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs7 === errors;}else {var valid3 = true;}if(valid3){if(data1.eventSource !== undefined){const _errs9 = errors;if("aws:s3" !== data1.eventSource){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/eventSource",schemaPath:"#/properties/Records/items/properties/eventSource/const",keyword:"const",params:{allowedValue: "aws:s3"},message:"must be equal to constant"}];return false;}var valid3 = _errs9 === errors;}else {var valid3 = true;}if(valid3){if(data1.awsRegion !== undefined){const _errs10 = errors;if(typeof data1.awsRegion !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/awsRegion",schemaPath:"#/properties/Records/items/properties/awsRegion/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs10 === errors;}else {var valid3 = true;}if(valid3){if(data1.eventTime !== undefined){let data5 = data1.eventTime;const _errs12 = errors;if(errors === _errs12){if(errors === _errs12){if(typeof data5 === "string"){if(!(formats0.validate(data5))){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/eventTime",schemaPath:"#/properties/Records/items/properties/eventTime/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""}];return false;}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/eventTime",schemaPath:"#/properties/Records/items/properties/eventTime/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}var valid3 = _errs12 === errors;}else {var valid3 = true;}if(valid3){if(data1.eventName !== undefined){const _errs14 = errors;if(typeof data1.eventName !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/eventName",schemaPath:"#/properties/Records/items/properties/eventName/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs14 === errors;}else {var valid3 = true;}if(valid3){if(data1.userIdentity !== undefined){let data7 = data1.userIdentity;const _errs16 = errors;const _errs17 = errors;if(errors === _errs17){if(data7 && typeof data7 == "object" && !Array.isArray(data7)){let missing2;if((data7.principalId === undefined) && (missing2 = "principalId")){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/userIdentity",schemaPath:"#/$defs/S3Identity/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];return false;}else {if(data7.principalId !== undefined){if(typeof data7.principalId !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/userIdentity/principalId",schemaPath:"#/$defs/S3Identity/properties/principalId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/userIdentity",schemaPath:"#/$defs/S3Identity/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid3 = _errs16 === errors;}else {var valid3 = true;}if(valid3){if(data1.requestParameters !== undefined){let data9 = data1.requestParameters;const _errs22 = errors;const _errs23 = errors;if(errors === _errs23){if(data9 && typeof data9 == "object" && !Array.isArray(data9)){let missing3;if((data9.sourceIPAddress === undefined) && (missing3 = "sourceIPAddress")){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/requestParameters",schemaPath:"#/$defs/S3RequestParameters/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"}];return false;}else {if(data9.sourceIPAddress !== undefined){if(typeof data9.sourceIPAddress !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/requestParameters/sourceIPAddress",schemaPath:"#/$defs/S3RequestParameters/properties/sourceIPAddress/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/requestParameters",schemaPath:"#/$defs/S3RequestParameters/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid3 = _errs22 === errors;}else {var valid3 = true;}if(valid3){if(data1.responseElements !== undefined){let data11 = data1.responseElements;const _errs28 = errors;const _errs29 = errors;if(errors === _errs29){if(data11 && typeof data11 == "object" && !Array.isArray(data11)){let missing4;if(((data11["x-amz-id-2"] === undefined) && (missing4 = "x-amz-id-2")) || ((data11["x-amz-request-id"] === undefined) && (missing4 = "x-amz-request-id"))){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/responseElements",schemaPath:"#/$defs/S3ResponseElements/required",keyword:"required",params:{missingProperty: missing4},message:"must have required property '"+missing4+"'"}];return false;}else {if(data11["x-amz-request-id"] !== undefined){const _errs32 = errors;if(typeof data11["x-amz-request-id"] !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/responseElements/x-amz-request-id",schemaPath:"#/$defs/S3ResponseElements/properties/x-amz-request-id/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid9 = _errs32 === errors;}else {var valid9 = true;}if(valid9){if(data11["x-amz-id-2"] !== undefined){const _errs34 = errors;if(typeof data11["x-amz-id-2"] !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/responseElements/x-amz-id-2",schemaPath:"#/$defs/S3ResponseElements/properties/x-amz-id-2/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid9 = _errs34 === errors;}else {var valid9 = true;}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/responseElements",schemaPath:"#/$defs/S3ResponseElements/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid3 = _errs28 === errors;}else {var valid3 = true;}if(valid3){if(data1.s3 !== undefined){const _errs36 = errors;if(!(validate11(data1.s3, {instancePath:instancePath+"/Records/" + i0+"/s3",parentData:data1,parentDataProperty:"s3",rootData}))){vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);errors = vErrors.length;}var valid3 = _errs36 === errors;}else {var valid3 = true;}if(valid3){if(data1.glacierEventData !== undefined){let data15 = data1.glacierEventData;const _errs37 = errors;const _errs38 = errors;if(errors === _errs38){if(data15 && typeof data15 == "object" && !Array.isArray(data15)){let missing5;if((data15.restoreEventData === undefined) && (missing5 = "restoreEventData")){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/glacierEventData",schemaPath:"#/$defs/S3EventRecordGlacierEventData/required",keyword:"required",params:{missingProperty: missing5},message:"must have required property '"+missing5+"'"}];return false;}else {if(data15.restoreEventData !== undefined){let data16 = data15.restoreEventData;const _errs41 = errors;if(errors === _errs41){if(data16 && typeof data16 == "object" && !Array.isArray(data16)){let missing6;if(((data16.lifecycleRestorationExpiryTime === undefined) && (missing6 = "lifecycleRestorationExpiryTime")) || ((data16.lifecycleRestoreStorageClass === undefined) && (missing6 = "lifecycleRestoreStorageClass"))){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/glacierEventData/restoreEventData",schemaPath:"#/$defs/S3EventRecordGlacierEventData/properties/restoreEventData/required",keyword:"required",params:{missingProperty: missing6},message:"must have required property '"+missing6+"'"}];return false;}else {if(data16.lifecycleRestorationExpiryTime !== undefined){const _errs44 = errors;if(typeof data16.lifecycleRestorationExpiryTime !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/glacierEventData/restoreEventData/lifecycleRestorationExpiryTime",schemaPath:"#/$defs/S3EventRecordGlacierEventData/properties/restoreEventData/properties/lifecycleRestorationExpiryTime/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid12 = _errs44 === errors;}else {var valid12 = true;}if(valid12){if(data16.lifecycleRestoreStorageClass !== undefined){const _errs46 = errors;if(typeof data16.lifecycleRestoreStorageClass !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/glacierEventData/restoreEventData/lifecycleRestoreStorageClass",schemaPath:"#/$defs/S3EventRecordGlacierEventData/properties/restoreEventData/properties/lifecycleRestoreStorageClass/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid12 = _errs46 === errors;}else {var valid12 = true;}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/glacierEventData/restoreEventData",schemaPath:"#/$defs/S3EventRecordGlacierEventData/properties/restoreEventData/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/glacierEventData",schemaPath:"#/$defs/S3EventRecordGlacierEventData/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid3 = _errs37 === errors;}else {var valid3 = true;}}}}}}}}}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0,schemaPath:"#/properties/Records/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs4 === errors;if(!valid1){break;}}}else {validate10.errors = [{instancePath:instancePath+"/Records",schemaPath:"#/properties/Records/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;