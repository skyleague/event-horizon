/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"HttpError","type":"object","description":"The default error error response for both 400 & 500 type errors","properties":{"statusCode":{"type":"integer","description":"The status code of the response."},"message":{"type":"string","description":"A detailed message of the error."}},"required":["message","statusCode"],"additionalProperties":true};function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if(((data.message === undefined) && (missing0 = "message")) || ((data.statusCode === undefined) && (missing0 = "statusCode"))){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.statusCode !== undefined){let data0 = data.statusCode;const _errs2 = errors;if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){validate10.errors = [{instancePath:instancePath+"/statusCode",schemaPath:"#/properties/statusCode/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.message !== undefined){const _errs4 = errors;if(typeof data.message !== "string"){validate10.errors = [{instancePath:instancePath+"/message",schemaPath:"#/properties/message/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs4 === errors;}else {var valid0 = true;}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;