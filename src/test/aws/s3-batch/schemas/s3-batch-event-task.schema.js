/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"S3BatchEventTask","type":"object","properties":{"taskId":{"type":"string"},"s3Key":{"type":"string"},"s3VersionId":{"anyOf":[{"type":"string"},{"type":"null"}]},"s3BucketArn":{"type":"string"}},"required":["s3BucketArn","s3Key","s3VersionId","taskId"],"additionalProperties":true};function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if(((((data.s3BucketArn === undefined) && (missing0 = "s3BucketArn")) || ((data.s3Key === undefined) && (missing0 = "s3Key"))) || ((data.s3VersionId === undefined) && (missing0 = "s3VersionId"))) || ((data.taskId === undefined) && (missing0 = "taskId"))){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.taskId !== undefined){const _errs2 = errors;if(typeof data.taskId !== "string"){validate10.errors = [{instancePath:instancePath+"/taskId",schemaPath:"#/properties/taskId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.s3Key !== undefined){const _errs4 = errors;if(typeof data.s3Key !== "string"){validate10.errors = [{instancePath:instancePath+"/s3Key",schemaPath:"#/properties/s3Key/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs4 === errors;}else {var valid0 = true;}if(valid0){if(data.s3VersionId !== undefined){let data2 = data.s3VersionId;const _errs6 = errors;const _errs7 = errors;let valid1 = false;const _errs8 = errors;if(typeof data2 !== "string"){const err0 = {instancePath:instancePath+"/s3VersionId",schemaPath:"#/properties/s3VersionId/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}var _valid0 = _errs8 === errors;valid1 = valid1 || _valid0;if(!valid1){const _errs10 = errors;if(data2 !== null){const err1 = {instancePath:instancePath+"/s3VersionId",schemaPath:"#/properties/s3VersionId/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}var _valid0 = _errs10 === errors;valid1 = valid1 || _valid0;}if(!valid1){const err2 = {instancePath:instancePath+"/s3VersionId",schemaPath:"#/properties/s3VersionId/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;validate10.errors = vErrors;return false;}else {errors = _errs7;if(vErrors !== null){if(_errs7){vErrors.length = _errs7;}else {vErrors = null;}}}var valid0 = _errs6 === errors;}else {var valid0 = true;}if(valid0){if(data.s3BucketArn !== undefined){const _errs12 = errors;if(typeof data.s3BucketArn !== "string"){validate10.errors = [{instancePath:instancePath+"/s3BucketArn",schemaPath:"#/properties/s3BucketArn/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs12 === errors;}else {var valid0 = true;}}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;