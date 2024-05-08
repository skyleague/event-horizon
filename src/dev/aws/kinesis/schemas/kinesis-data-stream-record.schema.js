/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"KinesisDataStreamRecord","type":"object","properties":{"eventSource":{"const":"aws:kinesis"},"eventVersion":{"type":"string"},"eventID":{"type":"string"},"eventName":{"const":"aws:kinesis:record"},"invokeIdentityArn":{"type":"string"},"eventSourceARN":{"type":"string"},"kinesis":{"$ref":"#/$defs/KinesisDataStreamRecordPayload"}},"required":["eventID","eventName","eventSource","eventSourceARN","eventVersion","invokeIdentityArn","kinesis"],"additionalProperties":true,"$defs":{"KinesisDataStreamRecordPayload":{"type":"object","properties":{"kinesisSchemaVersion":{"type":"string"},"partitionKey":{"type":"string"},"sequenceNumber":{"type":"string"},"approximateArrivalTimestamp":{"type":"number"},"data":{"type":"string"}},"required":["approximateArrivalTimestamp","data","kinesisSchemaVersion","partitionKey","sequenceNumber"],"additionalProperties":true}}};const schema12 = {"type":"object","properties":{"kinesisSchemaVersion":{"type":"string"},"partitionKey":{"type":"string"},"sequenceNumber":{"type":"string"},"approximateArrivalTimestamp":{"type":"number"},"data":{"type":"string"}},"required":["approximateArrivalTimestamp","data","kinesisSchemaVersion","partitionKey","sequenceNumber"],"additionalProperties":true};function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;let valid0 = true;for( missing0 of schema11.required){valid0 = data[missing0] !== undefined;if(!valid0){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;break;}}if(valid0){if(data.eventSource !== undefined){const _errs2 = errors;if("aws:kinesis" !== data.eventSource){validate10.errors = [{instancePath:instancePath+"/eventSource",schemaPath:"#/properties/eventSource/const",keyword:"const",params:{allowedValue: "aws:kinesis"},message:"must be equal to constant"}];return false;}var valid1 = _errs2 === errors;}else {var valid1 = true;}if(valid1){if(data.eventVersion !== undefined){const _errs3 = errors;if(typeof data.eventVersion !== "string"){validate10.errors = [{instancePath:instancePath+"/eventVersion",schemaPath:"#/properties/eventVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs3 === errors;}else {var valid1 = true;}if(valid1){if(data.eventID !== undefined){const _errs5 = errors;if(typeof data.eventID !== "string"){validate10.errors = [{instancePath:instancePath+"/eventID",schemaPath:"#/properties/eventID/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs5 === errors;}else {var valid1 = true;}if(valid1){if(data.eventName !== undefined){const _errs7 = errors;if("aws:kinesis:record" !== data.eventName){validate10.errors = [{instancePath:instancePath+"/eventName",schemaPath:"#/properties/eventName/const",keyword:"const",params:{allowedValue: "aws:kinesis:record"},message:"must be equal to constant"}];return false;}var valid1 = _errs7 === errors;}else {var valid1 = true;}if(valid1){if(data.invokeIdentityArn !== undefined){const _errs8 = errors;if(typeof data.invokeIdentityArn !== "string"){validate10.errors = [{instancePath:instancePath+"/invokeIdentityArn",schemaPath:"#/properties/invokeIdentityArn/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs8 === errors;}else {var valid1 = true;}if(valid1){if(data.eventSourceARN !== undefined){const _errs10 = errors;if(typeof data.eventSourceARN !== "string"){validate10.errors = [{instancePath:instancePath+"/eventSourceARN",schemaPath:"#/properties/eventSourceARN/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs10 === errors;}else {var valid1 = true;}if(valid1){if(data.kinesis !== undefined){let data6 = data.kinesis;const _errs12 = errors;const _errs13 = errors;if(errors === _errs13){if(data6 && typeof data6 == "object" && !Array.isArray(data6)){let missing1;let valid3 = true;for( missing1 of schema12.required){valid3 = data6[missing1] !== undefined;if(!valid3){validate10.errors = [{instancePath:instancePath+"/kinesis",schemaPath:"#/$defs/KinesisDataStreamRecordPayload/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];return false;break;}}if(valid3){if(data6.kinesisSchemaVersion !== undefined){const _errs16 = errors;if(typeof data6.kinesisSchemaVersion !== "string"){validate10.errors = [{instancePath:instancePath+"/kinesis/kinesisSchemaVersion",schemaPath:"#/$defs/KinesisDataStreamRecordPayload/properties/kinesisSchemaVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs16 === errors;}else {var valid4 = true;}if(valid4){if(data6.partitionKey !== undefined){const _errs18 = errors;if(typeof data6.partitionKey !== "string"){validate10.errors = [{instancePath:instancePath+"/kinesis/partitionKey",schemaPath:"#/$defs/KinesisDataStreamRecordPayload/properties/partitionKey/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs18 === errors;}else {var valid4 = true;}if(valid4){if(data6.sequenceNumber !== undefined){const _errs20 = errors;if(typeof data6.sequenceNumber !== "string"){validate10.errors = [{instancePath:instancePath+"/kinesis/sequenceNumber",schemaPath:"#/$defs/KinesisDataStreamRecordPayload/properties/sequenceNumber/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs20 === errors;}else {var valid4 = true;}if(valid4){if(data6.approximateArrivalTimestamp !== undefined){let data10 = data6.approximateArrivalTimestamp;const _errs22 = errors;if(!((typeof data10 == "number") && (isFinite(data10)))){validate10.errors = [{instancePath:instancePath+"/kinesis/approximateArrivalTimestamp",schemaPath:"#/$defs/KinesisDataStreamRecordPayload/properties/approximateArrivalTimestamp/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid4 = _errs22 === errors;}else {var valid4 = true;}if(valid4){if(data6.data !== undefined){const _errs24 = errors;if(typeof data6.data !== "string"){validate10.errors = [{instancePath:instancePath+"/kinesis/data",schemaPath:"#/$defs/KinesisDataStreamRecordPayload/properties/data/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs24 === errors;}else {var valid4 = true;}}}}}}}else {validate10.errors = [{instancePath:instancePath+"/kinesis",schemaPath:"#/$defs/KinesisDataStreamRecordPayload/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs12 === errors;}else {var valid1 = true;}}}}}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;