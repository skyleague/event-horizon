/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"CloudWatchLogsSchema","type":"object","properties":{"awslogs":{"type":"object","properties":{"data":{"type":"string"}},"required":["data"],"additionalProperties":true}},"required":["awslogs"],"additionalProperties":true};function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((data.awslogs === undefined) && (missing0 = "awslogs")){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.awslogs !== undefined){let data0 = data.awslogs;const _errs2 = errors;if(errors === _errs2){if(data0 && typeof data0 == "object" && !Array.isArray(data0)){let missing1;if((data0.data === undefined) && (missing1 = "data")){validate10.errors = [{instancePath:instancePath+"/awslogs",schemaPath:"#/properties/awslogs/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];return false;}else {if(data0.data !== undefined){if(typeof data0.data !== "string"){validate10.errors = [{instancePath:instancePath+"/awslogs/data",schemaPath:"#/properties/awslogs/properties/data/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}}else {validate10.errors = [{instancePath:instancePath+"/awslogs",schemaPath:"#/properties/awslogs/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;