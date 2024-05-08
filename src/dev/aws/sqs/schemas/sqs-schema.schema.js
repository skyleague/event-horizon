/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"SqsSchema","type":"object","properties":{"Records":{"type":"array","items":{"type":"object","properties":{"messageId":{"type":"string"},"receiptHandle":{"type":"string"},"body":{"type":"string"},"attributes":{"$ref":"#/$defs/SqsAttributesSchema"},"messageAttributes":{"type":"object","additionalProperties":{"$ref":"#/$defs/SqsMsgAttributeSchema"}},"md5OfBody":{"type":"string"},"md5OfMessageAttributes":{"type":"string","nullable":true},"eventSource":{"const":"aws:sqs"},"eventSourceARN":{"type":"string"},"awsRegion":{"type":"string"}},"required":["attributes","awsRegion","body","eventSource","eventSourceARN","md5OfBody","messageAttributes","messageId","receiptHandle"],"additionalProperties":true}}},"required":["Records"],"additionalProperties":true,"$defs":{"SqsAttributesSchema":{"type":"object","properties":{"ApproximateReceiveCount":{"type":"string"},"ApproximateFirstReceiveTimestamp":{"type":"string"},"MessageDeduplicationId":{"type":"string"},"MessageGroupId":{"type":"string"},"SenderId":{"type":"string"},"SentTimestamp":{"type":"string"},"SequenceNumber":{"type":"string"},"AWSTraceHeader":{"type":"string"},"DeadLetterQueueSourceArn":{"type":"string"}},"required":["ApproximateFirstReceiveTimestamp","ApproximateReceiveCount","SenderId","SentTimestamp"],"additionalProperties":true},"SqsMsgAttributeSchema":{"type":"object","properties":{"stringValue":{"type":"string"},"binaryValue":{"type":"string"},"stringListValues":{"type":"array","items":{"type":"string"}},"binaryListValues":{"type":"array","items":{"type":"string"}},"dataType":{"type":"string"}},"required":["dataType"],"additionalProperties":true}}};const schema12 = {"type":"object","properties":{"ApproximateReceiveCount":{"type":"string"},"ApproximateFirstReceiveTimestamp":{"type":"string"},"MessageDeduplicationId":{"type":"string"},"MessageGroupId":{"type":"string"},"SenderId":{"type":"string"},"SentTimestamp":{"type":"string"},"SequenceNumber":{"type":"string"},"AWSTraceHeader":{"type":"string"},"DeadLetterQueueSourceArn":{"type":"string"}},"required":["ApproximateFirstReceiveTimestamp","ApproximateReceiveCount","SenderId","SentTimestamp"],"additionalProperties":true};const schema13 = {"type":"object","properties":{"stringValue":{"type":"string"},"binaryValue":{"type":"string"},"stringListValues":{"type":"array","items":{"type":"string"}},"binaryListValues":{"type":"array","items":{"type":"string"}},"dataType":{"type":"string"}},"required":["dataType"],"additionalProperties":true};function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((data.Records === undefined) && (missing0 = "Records")){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.Records !== undefined){let data0 = data.Records;const _errs2 = errors;if(errors === _errs2){if(Array.isArray(data0)){var valid1 = true;const len0 = data0.length;for(let i0=0; i0<len0; i0++){let data1 = data0[i0];const _errs4 = errors;if(errors === _errs4){if(data1 && typeof data1 == "object" && !Array.isArray(data1)){let missing1;let valid2 = true;for( missing1 of schema11.properties.Records.items.required){valid2 = data1[missing1] !== undefined;if(!valid2){validate10.errors = [{instancePath:instancePath+"/Records/" + i0,schemaPath:"#/properties/Records/items/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];return false;break;}}if(valid2){if(data1.messageId !== undefined){const _errs7 = errors;if(typeof data1.messageId !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/messageId",schemaPath:"#/properties/Records/items/properties/messageId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs7 === errors;}else {var valid3 = true;}if(valid3){if(data1.receiptHandle !== undefined){const _errs9 = errors;if(typeof data1.receiptHandle !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/receiptHandle",schemaPath:"#/properties/Records/items/properties/receiptHandle/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs9 === errors;}else {var valid3 = true;}if(valid3){if(data1.body !== undefined){const _errs11 = errors;if(typeof data1.body !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/body",schemaPath:"#/properties/Records/items/properties/body/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs11 === errors;}else {var valid3 = true;}if(valid3){if(data1.attributes !== undefined){let data5 = data1.attributes;const _errs13 = errors;const _errs14 = errors;if(errors === _errs14){if(data5 && typeof data5 == "object" && !Array.isArray(data5)){let missing2;if(((((data5.ApproximateFirstReceiveTimestamp === undefined) && (missing2 = "ApproximateFirstReceiveTimestamp")) || ((data5.ApproximateReceiveCount === undefined) && (missing2 = "ApproximateReceiveCount"))) || ((data5.SenderId === undefined) && (missing2 = "SenderId"))) || ((data5.SentTimestamp === undefined) && (missing2 = "SentTimestamp"))){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/attributes",schemaPath:"#/$defs/SqsAttributesSchema/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];return false;}else {if(data5.ApproximateReceiveCount !== undefined){const _errs17 = errors;if(typeof data5.ApproximateReceiveCount !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/attributes/ApproximateReceiveCount",schemaPath:"#/$defs/SqsAttributesSchema/properties/ApproximateReceiveCount/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid5 = _errs17 === errors;}else {var valid5 = true;}if(valid5){if(data5.ApproximateFirstReceiveTimestamp !== undefined){const _errs19 = errors;if(typeof data5.ApproximateFirstReceiveTimestamp !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/attributes/ApproximateFirstReceiveTimestamp",schemaPath:"#/$defs/SqsAttributesSchema/properties/ApproximateFirstReceiveTimestamp/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid5 = _errs19 === errors;}else {var valid5 = true;}if(valid5){if(data5.MessageDeduplicationId !== undefined){const _errs21 = errors;if(typeof data5.MessageDeduplicationId !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/attributes/MessageDeduplicationId",schemaPath:"#/$defs/SqsAttributesSchema/properties/MessageDeduplicationId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid5 = _errs21 === errors;}else {var valid5 = true;}if(valid5){if(data5.MessageGroupId !== undefined){const _errs23 = errors;if(typeof data5.MessageGroupId !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/attributes/MessageGroupId",schemaPath:"#/$defs/SqsAttributesSchema/properties/MessageGroupId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid5 = _errs23 === errors;}else {var valid5 = true;}if(valid5){if(data5.SenderId !== undefined){const _errs25 = errors;if(typeof data5.SenderId !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/attributes/SenderId",schemaPath:"#/$defs/SqsAttributesSchema/properties/SenderId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid5 = _errs25 === errors;}else {var valid5 = true;}if(valid5){if(data5.SentTimestamp !== undefined){const _errs27 = errors;if(typeof data5.SentTimestamp !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/attributes/SentTimestamp",schemaPath:"#/$defs/SqsAttributesSchema/properties/SentTimestamp/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid5 = _errs27 === errors;}else {var valid5 = true;}if(valid5){if(data5.SequenceNumber !== undefined){const _errs29 = errors;if(typeof data5.SequenceNumber !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/attributes/SequenceNumber",schemaPath:"#/$defs/SqsAttributesSchema/properties/SequenceNumber/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid5 = _errs29 === errors;}else {var valid5 = true;}if(valid5){if(data5.AWSTraceHeader !== undefined){const _errs31 = errors;if(typeof data5.AWSTraceHeader !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/attributes/AWSTraceHeader",schemaPath:"#/$defs/SqsAttributesSchema/properties/AWSTraceHeader/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid5 = _errs31 === errors;}else {var valid5 = true;}if(valid5){if(data5.DeadLetterQueueSourceArn !== undefined){const _errs33 = errors;if(typeof data5.DeadLetterQueueSourceArn !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/attributes/DeadLetterQueueSourceArn",schemaPath:"#/$defs/SqsAttributesSchema/properties/DeadLetterQueueSourceArn/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid5 = _errs33 === errors;}else {var valid5 = true;}}}}}}}}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/attributes",schemaPath:"#/$defs/SqsAttributesSchema/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid3 = _errs13 === errors;}else {var valid3 = true;}if(valid3){if(data1.messageAttributes !== undefined){let data15 = data1.messageAttributes;const _errs35 = errors;if(errors === _errs35){if(data15 && typeof data15 == "object" && !Array.isArray(data15)){for(const key0 in data15){let data16 = data15[key0];const _errs38 = errors;const _errs39 = errors;if(errors === _errs39){if(data16 && typeof data16 == "object" && !Array.isArray(data16)){let missing3;if((data16.dataType === undefined) && (missing3 = "dataType")){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/SqsMsgAttributeSchema/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"}];return false;}else {if(data16.stringValue !== undefined){const _errs42 = errors;if(typeof data16.stringValue !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/stringValue",schemaPath:"#/$defs/SqsMsgAttributeSchema/properties/stringValue/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid8 = _errs42 === errors;}else {var valid8 = true;}if(valid8){if(data16.binaryValue !== undefined){const _errs44 = errors;if(typeof data16.binaryValue !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/binaryValue",schemaPath:"#/$defs/SqsMsgAttributeSchema/properties/binaryValue/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid8 = _errs44 === errors;}else {var valid8 = true;}if(valid8){if(data16.stringListValues !== undefined){let data19 = data16.stringListValues;const _errs46 = errors;if(errors === _errs46){if(Array.isArray(data19)){var valid9 = true;const len1 = data19.length;for(let i1=0; i1<len1; i1++){const _errs48 = errors;if(typeof data19[i1] !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/stringListValues/" + i1,schemaPath:"#/$defs/SqsMsgAttributeSchema/properties/stringListValues/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid9 = _errs48 === errors;if(!valid9){break;}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/stringListValues",schemaPath:"#/$defs/SqsMsgAttributeSchema/properties/stringListValues/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid8 = _errs46 === errors;}else {var valid8 = true;}if(valid8){if(data16.binaryListValues !== undefined){let data21 = data16.binaryListValues;const _errs50 = errors;if(errors === _errs50){if(Array.isArray(data21)){var valid10 = true;const len2 = data21.length;for(let i2=0; i2<len2; i2++){const _errs52 = errors;if(typeof data21[i2] !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/binaryListValues/" + i2,schemaPath:"#/$defs/SqsMsgAttributeSchema/properties/binaryListValues/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid10 = _errs52 === errors;if(!valid10){break;}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/binaryListValues",schemaPath:"#/$defs/SqsMsgAttributeSchema/properties/binaryListValues/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid8 = _errs50 === errors;}else {var valid8 = true;}if(valid8){if(data16.dataType !== undefined){const _errs54 = errors;if(typeof data16.dataType !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/dataType",schemaPath:"#/$defs/SqsMsgAttributeSchema/properties/dataType/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid8 = _errs54 === errors;}else {var valid8 = true;}}}}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/SqsMsgAttributeSchema/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid6 = _errs38 === errors;if(!valid6){break;}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/messageAttributes",schemaPath:"#/properties/Records/items/properties/messageAttributes/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid3 = _errs35 === errors;}else {var valid3 = true;}if(valid3){if(data1.md5OfBody !== undefined){const _errs56 = errors;if(typeof data1.md5OfBody !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/md5OfBody",schemaPath:"#/properties/Records/items/properties/md5OfBody/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs56 === errors;}else {var valid3 = true;}if(valid3){if(data1.md5OfMessageAttributes !== undefined){let data25 = data1.md5OfMessageAttributes;const _errs58 = errors;if((typeof data25 !== "string") && (data25 !== null)){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/md5OfMessageAttributes",schemaPath:"#/properties/Records/items/properties/md5OfMessageAttributes/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs58 === errors;}else {var valid3 = true;}if(valid3){if(data1.eventSource !== undefined){const _errs61 = errors;if("aws:sqs" !== data1.eventSource){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/eventSource",schemaPath:"#/properties/Records/items/properties/eventSource/const",keyword:"const",params:{allowedValue: "aws:sqs"},message:"must be equal to constant"}];return false;}var valid3 = _errs61 === errors;}else {var valid3 = true;}if(valid3){if(data1.eventSourceARN !== undefined){const _errs62 = errors;if(typeof data1.eventSourceARN !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/eventSourceARN",schemaPath:"#/properties/Records/items/properties/eventSourceARN/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs62 === errors;}else {var valid3 = true;}if(valid3){if(data1.awsRegion !== undefined){const _errs64 = errors;if(typeof data1.awsRegion !== "string"){validate10.errors = [{instancePath:instancePath+"/Records/" + i0+"/awsRegion",schemaPath:"#/properties/Records/items/properties/awsRegion/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs64 === errors;}else {var valid3 = true;}}}}}}}}}}}}else {validate10.errors = [{instancePath:instancePath+"/Records/" + i0,schemaPath:"#/properties/Records/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs4 === errors;if(!valid1){break;}}}else {validate10.errors = [{instancePath:instancePath+"/Records",schemaPath:"#/properties/Records/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;