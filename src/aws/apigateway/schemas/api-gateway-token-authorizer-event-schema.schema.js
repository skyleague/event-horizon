/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"APIGatewayTokenAuthorizerEventSchema","type":"object","properties":{"type":{"const":"TOKEN"},"authorizationToken":{"type":"string"},"methodArn":{"type":"string"}},"required":["authorizationToken","methodArn","type"],"additionalProperties":true};function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((((data.authorizationToken === undefined) && (missing0 = "authorizationToken")) || ((data.methodArn === undefined) && (missing0 = "methodArn"))) || ((data.type === undefined) && (missing0 = "type"))){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.type !== undefined){const _errs2 = errors;if("TOKEN" !== data.type){validate10.errors = [{instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "TOKEN"},message:"must be equal to constant"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.authorizationToken !== undefined){const _errs3 = errors;if(typeof data.authorizationToken !== "string"){validate10.errors = [{instancePath:instancePath+"/authorizationToken",schemaPath:"#/properties/authorizationToken/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs3 === errors;}else {var valid0 = true;}if(valid0){if(data.methodArn !== undefined){const _errs5 = errors;if(typeof data.methodArn !== "string"){validate10.errors = [{instancePath:instancePath+"/methodArn",schemaPath:"#/properties/methodArn/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs5 === errors;}else {var valid0 = true;}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;