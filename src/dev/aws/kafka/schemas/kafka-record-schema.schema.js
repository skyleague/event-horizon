/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"KafkaRecordSchema","type":"object","properties":{"topic":{"type":"string"},"partition":{"type":"number"},"offset":{"type":"number"},"timestamp":{"type":"number"},"timestampType":{"type":"string"},"key":{"type":"string"},"value":{"type":"string"},"headers":{"type":"array","items":{"type":"object","additionalProperties":{"type":"array","items":{"type":"number"}}}}},"required":["headers","key","offset","partition","timestamp","timestampType","topic","value"],"additionalProperties":true};function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;let valid0 = true;for( missing0 of schema11.required){valid0 = data[missing0] !== undefined;if(!valid0){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;break;}}if(valid0){if(data.topic !== undefined){const _errs2 = errors;if(typeof data.topic !== "string"){validate10.errors = [{instancePath:instancePath+"/topic",schemaPath:"#/properties/topic/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs2 === errors;}else {var valid1 = true;}if(valid1){if(data.partition !== undefined){let data1 = data.partition;const _errs4 = errors;if(!((typeof data1 == "number") && (isFinite(data1)))){validate10.errors = [{instancePath:instancePath+"/partition",schemaPath:"#/properties/partition/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid1 = _errs4 === errors;}else {var valid1 = true;}if(valid1){if(data.offset !== undefined){let data2 = data.offset;const _errs6 = errors;if(!((typeof data2 == "number") && (isFinite(data2)))){validate10.errors = [{instancePath:instancePath+"/offset",schemaPath:"#/properties/offset/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid1 = _errs6 === errors;}else {var valid1 = true;}if(valid1){if(data.timestamp !== undefined){let data3 = data.timestamp;const _errs8 = errors;if(!((typeof data3 == "number") && (isFinite(data3)))){validate10.errors = [{instancePath:instancePath+"/timestamp",schemaPath:"#/properties/timestamp/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid1 = _errs8 === errors;}else {var valid1 = true;}if(valid1){if(data.timestampType !== undefined){const _errs10 = errors;if(typeof data.timestampType !== "string"){validate10.errors = [{instancePath:instancePath+"/timestampType",schemaPath:"#/properties/timestampType/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs10 === errors;}else {var valid1 = true;}if(valid1){if(data.key !== undefined){const _errs12 = errors;if(typeof data.key !== "string"){validate10.errors = [{instancePath:instancePath+"/key",schemaPath:"#/properties/key/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs12 === errors;}else {var valid1 = true;}if(valid1){if(data.value !== undefined){const _errs14 = errors;if(typeof data.value !== "string"){validate10.errors = [{instancePath:instancePath+"/value",schemaPath:"#/properties/value/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs14 === errors;}else {var valid1 = true;}if(valid1){if(data.headers !== undefined){let data7 = data.headers;const _errs16 = errors;if(errors === _errs16){if(Array.isArray(data7)){var valid2 = true;const len0 = data7.length;for(let i0=0; i0<len0; i0++){let data8 = data7[i0];const _errs18 = errors;if(errors === _errs18){if(data8 && typeof data8 == "object" && !Array.isArray(data8)){for(const key0 in data8){let data9 = data8[key0];const _errs21 = errors;if(errors === _errs21){if(Array.isArray(data9)){var valid4 = true;const len1 = data9.length;for(let i1=0; i1<len1; i1++){let data10 = data9[i1];const _errs23 = errors;if(!((typeof data10 == "number") && (isFinite(data10)))){validate10.errors = [{instancePath:instancePath+"/headers/" + i0+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i1,schemaPath:"#/properties/headers/items/additionalProperties/items/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid4 = _errs23 === errors;if(!valid4){break;}}}else {validate10.errors = [{instancePath:instancePath+"/headers/" + i0+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/headers/items/additionalProperties/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid3 = _errs21 === errors;if(!valid3){break;}}}else {validate10.errors = [{instancePath:instancePath+"/headers/" + i0,schemaPath:"#/properties/headers/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid2 = _errs18 === errors;if(!valid2){break;}}}else {validate10.errors = [{instancePath:instancePath+"/headers",schemaPath:"#/properties/headers/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid1 = _errs16 === errors;}else {var valid1 = true;}}}}}}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;