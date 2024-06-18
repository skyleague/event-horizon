/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
import { fullFormats as ajvFormatsDistFormatsFullFormats } from 'ajv-formats/dist/formats.js';
"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"EventBridgeSchema","type":"object","properties":{"version":{"type":"string"},"id":{"type":"string"},"source":{"type":"string"},"account":{"type":"string"},"time":{"type":"string","format":"date-time"},"region":{"type":"string"},"resources":{"type":"array","items":{"type":"string"}},"detail-type":{"type":"string"},"detail":{},"replay-name":{"type":"string"}},"required":["account","detail","detail-type","id","region","resources","source","time","version"],"additionalProperties":true};const formats0 = ajvFormatsDistFormatsFullFormats["date-time"];function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;let valid0 = true;for( missing0 of schema11.required){valid0 = data[missing0] !== undefined;if(!valid0){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;break;}}if(valid0){if(data.version !== undefined){const _errs2 = errors;if(typeof data.version !== "string"){validate10.errors = [{instancePath:instancePath+"/version",schemaPath:"#/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs2 === errors;}else {var valid1 = true;}if(valid1){if(data.id !== undefined){const _errs4 = errors;if(typeof data.id !== "string"){validate10.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs4 === errors;}else {var valid1 = true;}if(valid1){if(data.source !== undefined){const _errs6 = errors;if(typeof data.source !== "string"){validate10.errors = [{instancePath:instancePath+"/source",schemaPath:"#/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs6 === errors;}else {var valid1 = true;}if(valid1){if(data.account !== undefined){const _errs8 = errors;if(typeof data.account !== "string"){validate10.errors = [{instancePath:instancePath+"/account",schemaPath:"#/properties/account/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs8 === errors;}else {var valid1 = true;}if(valid1){if(data.time !== undefined){let data4 = data.time;const _errs10 = errors;if(errors === _errs10){if(errors === _errs10){if(typeof data4 === "string"){if(!(formats0.validate(data4))){validate10.errors = [{instancePath:instancePath+"/time",schemaPath:"#/properties/time/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""}];return false;}}else {validate10.errors = [{instancePath:instancePath+"/time",schemaPath:"#/properties/time/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}var valid1 = _errs10 === errors;}else {var valid1 = true;}if(valid1){if(data.region !== undefined){const _errs12 = errors;if(typeof data.region !== "string"){validate10.errors = [{instancePath:instancePath+"/region",schemaPath:"#/properties/region/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs12 === errors;}else {var valid1 = true;}if(valid1){if(data.resources !== undefined){let data6 = data.resources;const _errs14 = errors;if(errors === _errs14){if(Array.isArray(data6)){var valid2 = true;const len0 = data6.length;for(let i0=0; i0<len0; i0++){const _errs16 = errors;if(typeof data6[i0] !== "string"){validate10.errors = [{instancePath:instancePath+"/resources/" + i0,schemaPath:"#/properties/resources/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid2 = _errs16 === errors;if(!valid2){break;}}}else {validate10.errors = [{instancePath:instancePath+"/resources",schemaPath:"#/properties/resources/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid1 = _errs14 === errors;}else {var valid1 = true;}if(valid1){if(data["detail-type"] !== undefined){const _errs18 = errors;if(typeof data["detail-type"] !== "string"){validate10.errors = [{instancePath:instancePath+"/detail-type",schemaPath:"#/properties/detail-type/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs18 === errors;}else {var valid1 = true;}if(valid1){if(data["replay-name"] !== undefined){const _errs20 = errors;if(typeof data["replay-name"] !== "string"){validate10.errors = [{instancePath:instancePath+"/replay-name",schemaPath:"#/properties/replay-name/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs20 === errors;}else {var valid1 = true;}}}}}}}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;