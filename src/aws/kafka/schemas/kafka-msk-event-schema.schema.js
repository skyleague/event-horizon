/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"KafkaMskEventSchema","type":"object","properties":{"bootstrapServers":{"type":["string","null"]},"records":{"type":"object","additionalProperties":{"type":"array","items":{"type":"object","properties":{"topic":{"type":"string"},"partition":{"type":"number"},"offset":{"type":"number"},"timestamp":{"type":"number"},"timestampType":{"type":"string"},"key":{"type":"string"},"value":{"type":"string"},"headers":{"type":"array","items":{"type":"object","additionalProperties":{"type":"array","items":{"type":"number"}}}}},"required":["headers","key","offset","partition","timestamp","timestampType","topic","value"],"additionalProperties":true}}},"eventSource":{"const":"aws:kafka"},"eventSourceArn":{"type":"string"}},"required":["eventSource","eventSourceArn","records"],"additionalProperties":true};function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((((data.eventSource === undefined) && (missing0 = "eventSource")) || ((data.eventSourceArn === undefined) && (missing0 = "eventSourceArn"))) || ((data.records === undefined) && (missing0 = "records"))){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.bootstrapServers !== undefined){let data0 = data.bootstrapServers;const _errs2 = errors;if((typeof data0 !== "string") && (data0 !== null)){validate10.errors = [{instancePath:instancePath+"/bootstrapServers",schemaPath:"#/properties/bootstrapServers/type",keyword:"type",params:{type: schema11.properties.bootstrapServers.type},message:"must be string,null"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.records !== undefined){let data1 = data.records;const _errs4 = errors;if(errors === _errs4){if(data1 && typeof data1 == "object" && !Array.isArray(data1)){for(const key0 in data1){let data2 = data1[key0];const _errs7 = errors;if(errors === _errs7){if(Array.isArray(data2)){var valid2 = true;const len0 = data2.length;for(let i0=0; i0<len0; i0++){let data3 = data2[i0];const _errs9 = errors;if(errors === _errs9){if(data3 && typeof data3 == "object" && !Array.isArray(data3)){let missing1;let valid3 = true;for( missing1 of schema11.properties.records.additionalProperties.items.required){valid3 = data3[missing1] !== undefined;if(!valid3){validate10.errors = [{instancePath:instancePath+"/records/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i0,schemaPath:"#/properties/records/additionalProperties/items/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];return false;break;}}if(valid3){if(data3.topic !== undefined){const _errs12 = errors;if(typeof data3.topic !== "string"){validate10.errors = [{instancePath:instancePath+"/records/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i0+"/topic",schemaPath:"#/properties/records/additionalProperties/items/properties/topic/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs12 === errors;}else {var valid4 = true;}if(valid4){if(data3.partition !== undefined){let data5 = data3.partition;const _errs14 = errors;if(!((typeof data5 == "number") && (isFinite(data5)))){validate10.errors = [{instancePath:instancePath+"/records/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i0+"/partition",schemaPath:"#/properties/records/additionalProperties/items/properties/partition/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid4 = _errs14 === errors;}else {var valid4 = true;}if(valid4){if(data3.offset !== undefined){let data6 = data3.offset;const _errs16 = errors;if(!((typeof data6 == "number") && (isFinite(data6)))){validate10.errors = [{instancePath:instancePath+"/records/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i0+"/offset",schemaPath:"#/properties/records/additionalProperties/items/properties/offset/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid4 = _errs16 === errors;}else {var valid4 = true;}if(valid4){if(data3.timestamp !== undefined){let data7 = data3.timestamp;const _errs18 = errors;if(!((typeof data7 == "number") && (isFinite(data7)))){validate10.errors = [{instancePath:instancePath+"/records/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i0+"/timestamp",schemaPath:"#/properties/records/additionalProperties/items/properties/timestamp/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid4 = _errs18 === errors;}else {var valid4 = true;}if(valid4){if(data3.timestampType !== undefined){const _errs20 = errors;if(typeof data3.timestampType !== "string"){validate10.errors = [{instancePath:instancePath+"/records/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i0+"/timestampType",schemaPath:"#/properties/records/additionalProperties/items/properties/timestampType/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs20 === errors;}else {var valid4 = true;}if(valid4){if(data3.key !== undefined){const _errs22 = errors;if(typeof data3.key !== "string"){validate10.errors = [{instancePath:instancePath+"/records/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i0+"/key",schemaPath:"#/properties/records/additionalProperties/items/properties/key/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs22 === errors;}else {var valid4 = true;}if(valid4){if(data3.value !== undefined){const _errs24 = errors;if(typeof data3.value !== "string"){validate10.errors = [{instancePath:instancePath+"/records/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i0+"/value",schemaPath:"#/properties/records/additionalProperties/items/properties/value/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs24 === errors;}else {var valid4 = true;}if(valid4){if(data3.headers !== undefined){let data11 = data3.headers;const _errs26 = errors;if(errors === _errs26){if(Array.isArray(data11)){var valid5 = true;const len1 = data11.length;for(let i1=0; i1<len1; i1++){let data12 = data11[i1];const _errs28 = errors;if(errors === _errs28){if(data12 && typeof data12 == "object" && !Array.isArray(data12)){for(const key1 in data12){let data13 = data12[key1];const _errs31 = errors;if(errors === _errs31){if(Array.isArray(data13)){var valid7 = true;const len2 = data13.length;for(let i2=0; i2<len2; i2++){let data14 = data13[i2];const _errs33 = errors;if(!((typeof data14 == "number") && (isFinite(data14)))){validate10.errors = [{instancePath:instancePath+"/records/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i0+"/headers/" + i1+"/" + key1.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i2,schemaPath:"#/properties/records/additionalProperties/items/properties/headers/items/additionalProperties/items/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid7 = _errs33 === errors;if(!valid7){break;}}}else {validate10.errors = [{instancePath:instancePath+"/records/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i0+"/headers/" + i1+"/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/records/additionalProperties/items/properties/headers/items/additionalProperties/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid6 = _errs31 === errors;if(!valid6){break;}}}else {validate10.errors = [{instancePath:instancePath+"/records/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i0+"/headers/" + i1,schemaPath:"#/properties/records/additionalProperties/items/properties/headers/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid5 = _errs28 === errors;if(!valid5){break;}}}else {validate10.errors = [{instancePath:instancePath+"/records/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i0+"/headers",schemaPath:"#/properties/records/additionalProperties/items/properties/headers/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid4 = _errs26 === errors;}else {var valid4 = true;}}}}}}}}}}else {validate10.errors = [{instancePath:instancePath+"/records/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/" + i0,schemaPath:"#/properties/records/additionalProperties/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid2 = _errs9 === errors;if(!valid2){break;}}}else {validate10.errors = [{instancePath:instancePath+"/records/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/records/additionalProperties/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid1 = _errs7 === errors;if(!valid1){break;}}}else {validate10.errors = [{instancePath:instancePath+"/records",schemaPath:"#/properties/records/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid0 = _errs4 === errors;}else {var valid0 = true;}if(valid0){if(data.eventSource !== undefined){const _errs35 = errors;if("aws:kafka" !== data.eventSource){validate10.errors = [{instancePath:instancePath+"/eventSource",schemaPath:"#/properties/eventSource/const",keyword:"const",params:{allowedValue: "aws:kafka"},message:"must be equal to constant"}];return false;}var valid0 = _errs35 === errors;}else {var valid0 = true;}if(valid0){if(data.eventSourceArn !== undefined){const _errs36 = errors;if(typeof data.eventSourceArn !== "string"){validate10.errors = [{instancePath:instancePath+"/eventSourceArn",schemaPath:"#/properties/eventSourceArn/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs36 === errors;}else {var valid0 = true;}}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;