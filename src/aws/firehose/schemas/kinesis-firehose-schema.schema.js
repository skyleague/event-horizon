/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"KinesisFirehoseSchema","type":"object","properties":{"invocationId":{"type":"string"},"deliveryStreamArn":{"type":"string"},"region":{"type":"string"},"sourceKinesisStreamArn":{"type":"string"},"records":{"type":"array","items":{"$ref":"#/$defs/KinesisFirehoseRecord"}}},"required":["deliveryStreamArn","invocationId","records","region"],"additionalProperties":true,"$defs":{"KinesisFirehoseRecord":{"type":"object","properties":{"recordId":{"type":"string"},"approximateArrivalTimestamp":{"type":"number","exclusiveMinimum":0},"kinesisRecordMetadata":{"anyOf":[{"$ref":"#/$defs/KinesisRecordMetadata"},{"type":"null"}]},"data":{"type":"string"}},"required":["approximateArrivalTimestamp","data","recordId"],"additionalProperties":true},"KinesisRecordMetadata":{"type":["object","null"],"properties":{"shardId":{"type":"string"},"partitionKey":{"type":"string"},"approximateArrivalTimestamp":{"type":"number","exclusiveMinimum":0},"sequenceNumber":{"type":"string"},"subsequenceNumber":{"type":"number"}},"required":["approximateArrivalTimestamp","partitionKey","sequenceNumber","shardId","subsequenceNumber"],"additionalProperties":true}}};const schema12 = {"type":"object","properties":{"recordId":{"type":"string"},"approximateArrivalTimestamp":{"type":"number","exclusiveMinimum":0},"kinesisRecordMetadata":{"anyOf":[{"$ref":"#/$defs/KinesisRecordMetadata"},{"type":"null"}]},"data":{"type":"string"}},"required":["approximateArrivalTimestamp","data","recordId"],"additionalProperties":true};const schema13 = {"type":["object","null"],"properties":{"shardId":{"type":"string"},"partitionKey":{"type":"string"},"approximateArrivalTimestamp":{"type":"number","exclusiveMinimum":0},"sequenceNumber":{"type":"string"},"subsequenceNumber":{"type":"number"}},"required":["approximateArrivalTimestamp","partitionKey","sequenceNumber","shardId","subsequenceNumber"],"additionalProperties":true};function validate11(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((((data.approximateArrivalTimestamp === undefined) && (missing0 = "approximateArrivalTimestamp")) || ((data.data === undefined) && (missing0 = "data"))) || ((data.recordId === undefined) && (missing0 = "recordId"))){validate11.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.recordId !== undefined){const _errs2 = errors;if(typeof data.recordId !== "string"){validate11.errors = [{instancePath:instancePath+"/recordId",schemaPath:"#/properties/recordId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.approximateArrivalTimestamp !== undefined){let data1 = data.approximateArrivalTimestamp;const _errs4 = errors;if(errors === _errs4){if((typeof data1 == "number") && (isFinite(data1))){if(data1 <= 0 || isNaN(data1)){validate11.errors = [{instancePath:instancePath+"/approximateArrivalTimestamp",schemaPath:"#/properties/approximateArrivalTimestamp/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"}];return false;}}else {validate11.errors = [{instancePath:instancePath+"/approximateArrivalTimestamp",schemaPath:"#/properties/approximateArrivalTimestamp/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}}var valid0 = _errs4 === errors;}else {var valid0 = true;}if(valid0){if(data.kinesisRecordMetadata !== undefined){let data2 = data.kinesisRecordMetadata;const _errs6 = errors;const _errs7 = errors;let valid1 = false;const _errs8 = errors;const _errs9 = errors;if((!(data2 && typeof data2 == "object" && !Array.isArray(data2))) && (data2 !== null)){const err0 = {instancePath:instancePath+"/kinesisRecordMetadata",schemaPath:"#/$defs/KinesisRecordMetadata/type",keyword:"type",params:{type: schema13.type},message:"must be object,null"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}if(errors === _errs9){if(data2 && typeof data2 == "object" && !Array.isArray(data2)){let missing1;let valid3 = true;for( missing1 of schema13.required){valid3 = data2[missing1] !== undefined;if(!valid3){const err1 = {instancePath:instancePath+"/kinesisRecordMetadata",schemaPath:"#/$defs/KinesisRecordMetadata/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;break;}}if(valid3){if(data2.shardId !== undefined){const _errs12 = errors;if(typeof data2.shardId !== "string"){const err2 = {instancePath:instancePath+"/kinesisRecordMetadata/shardId",schemaPath:"#/$defs/KinesisRecordMetadata/properties/shardId/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;}var valid4 = _errs12 === errors;}else {var valid4 = true;}if(valid4){if(data2.partitionKey !== undefined){const _errs14 = errors;if(typeof data2.partitionKey !== "string"){const err3 = {instancePath:instancePath+"/kinesisRecordMetadata/partitionKey",schemaPath:"#/$defs/KinesisRecordMetadata/properties/partitionKey/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}var valid4 = _errs14 === errors;}else {var valid4 = true;}if(valid4){if(data2.approximateArrivalTimestamp !== undefined){let data5 = data2.approximateArrivalTimestamp;const _errs16 = errors;if(errors === _errs16){if((typeof data5 == "number") && (isFinite(data5))){if(data5 <= 0 || isNaN(data5)){const err4 = {instancePath:instancePath+"/kinesisRecordMetadata/approximateArrivalTimestamp",schemaPath:"#/$defs/KinesisRecordMetadata/properties/approximateArrivalTimestamp/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;}}else {const err5 = {instancePath:instancePath+"/kinesisRecordMetadata/approximateArrivalTimestamp",schemaPath:"#/$defs/KinesisRecordMetadata/properties/approximateArrivalTimestamp/type",keyword:"type",params:{type: "number"},message:"must be number"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}}var valid4 = _errs16 === errors;}else {var valid4 = true;}if(valid4){if(data2.sequenceNumber !== undefined){const _errs18 = errors;if(typeof data2.sequenceNumber !== "string"){const err6 = {instancePath:instancePath+"/kinesisRecordMetadata/sequenceNumber",schemaPath:"#/$defs/KinesisRecordMetadata/properties/sequenceNumber/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}var valid4 = _errs18 === errors;}else {var valid4 = true;}if(valid4){if(data2.subsequenceNumber !== undefined){let data7 = data2.subsequenceNumber;const _errs20 = errors;if(!((typeof data7 == "number") && (isFinite(data7)))){const err7 = {instancePath:instancePath+"/kinesisRecordMetadata/subsequenceNumber",schemaPath:"#/$defs/KinesisRecordMetadata/properties/subsequenceNumber/type",keyword:"type",params:{type: "number"},message:"must be number"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}var valid4 = _errs20 === errors;}else {var valid4 = true;}}}}}}}}var _valid0 = _errs8 === errors;valid1 = valid1 || _valid0;if(!valid1){const _errs22 = errors;if(data2 !== null){const err8 = {instancePath:instancePath+"/kinesisRecordMetadata",schemaPath:"#/properties/kinesisRecordMetadata/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err8];}else {vErrors.push(err8);}errors++;}var _valid0 = _errs22 === errors;valid1 = valid1 || _valid0;}if(!valid1){const err9 = {instancePath:instancePath+"/kinesisRecordMetadata",schemaPath:"#/properties/kinesisRecordMetadata/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;validate11.errors = vErrors;return false;}else {errors = _errs7;if(vErrors !== null){if(_errs7){vErrors.length = _errs7;}else {vErrors = null;}}}var valid0 = _errs6 === errors;}else {var valid0 = true;}if(valid0){if(data.data !== undefined){const _errs24 = errors;if(typeof data.data !== "string"){validate11.errors = [{instancePath:instancePath+"/data",schemaPath:"#/properties/data/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs24 === errors;}else {var valid0 = true;}}}}}}else {validate11.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate11.errors = vErrors;return errors === 0;}function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if(((((data.deliveryStreamArn === undefined) && (missing0 = "deliveryStreamArn")) || ((data.invocationId === undefined) && (missing0 = "invocationId"))) || ((data.records === undefined) && (missing0 = "records"))) || ((data.region === undefined) && (missing0 = "region"))){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.invocationId !== undefined){const _errs2 = errors;if(typeof data.invocationId !== "string"){validate10.errors = [{instancePath:instancePath+"/invocationId",schemaPath:"#/properties/invocationId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.deliveryStreamArn !== undefined){const _errs4 = errors;if(typeof data.deliveryStreamArn !== "string"){validate10.errors = [{instancePath:instancePath+"/deliveryStreamArn",schemaPath:"#/properties/deliveryStreamArn/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs4 === errors;}else {var valid0 = true;}if(valid0){if(data.region !== undefined){const _errs6 = errors;if(typeof data.region !== "string"){validate10.errors = [{instancePath:instancePath+"/region",schemaPath:"#/properties/region/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs6 === errors;}else {var valid0 = true;}if(valid0){if(data.sourceKinesisStreamArn !== undefined){const _errs8 = errors;if(typeof data.sourceKinesisStreamArn !== "string"){validate10.errors = [{instancePath:instancePath+"/sourceKinesisStreamArn",schemaPath:"#/properties/sourceKinesisStreamArn/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs8 === errors;}else {var valid0 = true;}if(valid0){if(data.records !== undefined){let data4 = data.records;const _errs10 = errors;if(errors === _errs10){if(Array.isArray(data4)){var valid1 = true;const len0 = data4.length;for(let i0=0; i0<len0; i0++){const _errs12 = errors;if(!(validate11(data4[i0], {instancePath:instancePath+"/records/" + i0,parentData:data4,parentDataProperty:i0,rootData}))){vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);errors = vErrors.length;}var valid1 = _errs12 === errors;if(!valid1){break;}}}else {validate10.errors = [{instancePath:instancePath+"/records",schemaPath:"#/properties/records/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid0 = _errs10 === errors;}else {var valid0 = true;}}}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;