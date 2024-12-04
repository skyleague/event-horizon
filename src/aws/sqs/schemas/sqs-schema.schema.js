/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"SqsSchema","type":"object","properties":{"Records":{"type":"array","items":{"$ref":"#/$defs/SqsRecordSchema"}}},"required":["Records"],"additionalProperties":true,"$defs":{"SqsRecordSchema":{"type":"object","properties":{"messageId":{"type":"string"},"receiptHandle":{"type":"string"},"body":{"type":"string"},"attributes":{"$ref":"#/$defs/SqsAttributesSchema"},"messageAttributes":{"type":"object","additionalProperties":{"$ref":"#/$defs/SqsMsgAttributeSchema"}},"md5OfBody":{"type":"string"},"md5OfMessageAttributes":{"type":["string","null"]},"eventSource":{"const":"aws:sqs"},"eventSourceARN":{"type":"string"},"awsRegion":{"type":"string"}},"required":["attributes","awsRegion","body","eventSource","eventSourceARN","md5OfBody","messageAttributes","messageId","receiptHandle"],"additionalProperties":true},"SqsAttributesSchema":{"type":"object","properties":{"ApproximateReceiveCount":{"type":"string"},"ApproximateFirstReceiveTimestamp":{"type":"string"},"MessageDeduplicationId":{"type":"string"},"MessageGroupId":{"type":"string"},"SenderId":{"type":"string"},"SentTimestamp":{"type":"string"},"SequenceNumber":{"type":"string"},"AWSTraceHeader":{"type":"string"},"DeadLetterQueueSourceArn":{"type":"string"}},"required":["ApproximateFirstReceiveTimestamp","ApproximateReceiveCount","SenderId","SentTimestamp"],"additionalProperties":true},"SqsMsgAttributeSchema":{"type":"object","properties":{"stringValue":{"type":"string"},"binaryValue":{"type":"string"},"stringListValues":{"type":"array","items":{"type":"string"}},"binaryListValues":{"type":"array","items":{"type":"string"}},"dataType":{"type":"string"}},"required":["dataType"],"additionalProperties":true}}};const schema12 = {"type":"object","properties":{"messageId":{"type":"string"},"receiptHandle":{"type":"string"},"body":{"type":"string"},"attributes":{"$ref":"#/$defs/SqsAttributesSchema"},"messageAttributes":{"type":"object","additionalProperties":{"$ref":"#/$defs/SqsMsgAttributeSchema"}},"md5OfBody":{"type":"string"},"md5OfMessageAttributes":{"type":["string","null"]},"eventSource":{"const":"aws:sqs"},"eventSourceARN":{"type":"string"},"awsRegion":{"type":"string"}},"required":["attributes","awsRegion","body","eventSource","eventSourceARN","md5OfBody","messageAttributes","messageId","receiptHandle"],"additionalProperties":true};const schema13 = {"type":"object","properties":{"ApproximateReceiveCount":{"type":"string"},"ApproximateFirstReceiveTimestamp":{"type":"string"},"MessageDeduplicationId":{"type":"string"},"MessageGroupId":{"type":"string"},"SenderId":{"type":"string"},"SentTimestamp":{"type":"string"},"SequenceNumber":{"type":"string"},"AWSTraceHeader":{"type":"string"},"DeadLetterQueueSourceArn":{"type":"string"}},"required":["ApproximateFirstReceiveTimestamp","ApproximateReceiveCount","SenderId","SentTimestamp"],"additionalProperties":true};const schema14 = {"type":"object","properties":{"stringValue":{"type":"string"},"binaryValue":{"type":"string"},"stringListValues":{"type":"array","items":{"type":"string"}},"binaryListValues":{"type":"array","items":{"type":"string"}},"dataType":{"type":"string"}},"required":["dataType"],"additionalProperties":true};function validate11(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;let valid0 = true;for( missing0 of schema12.required){valid0 = data[missing0] !== undefined;if(!valid0){validate11.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;break;}}if(valid0){if(data.messageId !== undefined){const _errs2 = errors;if(typeof data.messageId !== "string"){validate11.errors = [{instancePath:instancePath+"/messageId",schemaPath:"#/properties/messageId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs2 === errors;}else {var valid1 = true;}if(valid1){if(data.receiptHandle !== undefined){const _errs4 = errors;if(typeof data.receiptHandle !== "string"){validate11.errors = [{instancePath:instancePath+"/receiptHandle",schemaPath:"#/properties/receiptHandle/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs4 === errors;}else {var valid1 = true;}if(valid1){if(data.body !== undefined){const _errs6 = errors;if(typeof data.body !== "string"){validate11.errors = [{instancePath:instancePath+"/body",schemaPath:"#/properties/body/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs6 === errors;}else {var valid1 = true;}if(valid1){if(data.attributes !== undefined){let data3 = data.attributes;const _errs8 = errors;const _errs9 = errors;if(errors === _errs9){if(data3 && typeof data3 == "object" && !Array.isArray(data3)){let missing1;if(((((data3.ApproximateFirstReceiveTimestamp === undefined) && (missing1 = "ApproximateFirstReceiveTimestamp")) || ((data3.ApproximateReceiveCount === undefined) && (missing1 = "ApproximateReceiveCount"))) || ((data3.SenderId === undefined) && (missing1 = "SenderId"))) || ((data3.SentTimestamp === undefined) && (missing1 = "SentTimestamp"))){validate11.errors = [{instancePath:instancePath+"/attributes",schemaPath:"#/$defs/SqsAttributesSchema/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];return false;}else {if(data3.ApproximateReceiveCount !== undefined){const _errs12 = errors;if(typeof data3.ApproximateReceiveCount !== "string"){validate11.errors = [{instancePath:instancePath+"/attributes/ApproximateReceiveCount",schemaPath:"#/$defs/SqsAttributesSchema/properties/ApproximateReceiveCount/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs12 === errors;}else {var valid3 = true;}if(valid3){if(data3.ApproximateFirstReceiveTimestamp !== undefined){const _errs14 = errors;if(typeof data3.ApproximateFirstReceiveTimestamp !== "string"){validate11.errors = [{instancePath:instancePath+"/attributes/ApproximateFirstReceiveTimestamp",schemaPath:"#/$defs/SqsAttributesSchema/properties/ApproximateFirstReceiveTimestamp/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs14 === errors;}else {var valid3 = true;}if(valid3){if(data3.MessageDeduplicationId !== undefined){const _errs16 = errors;if(typeof data3.MessageDeduplicationId !== "string"){validate11.errors = [{instancePath:instancePath+"/attributes/MessageDeduplicationId",schemaPath:"#/$defs/SqsAttributesSchema/properties/MessageDeduplicationId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs16 === errors;}else {var valid3 = true;}if(valid3){if(data3.MessageGroupId !== undefined){const _errs18 = errors;if(typeof data3.MessageGroupId !== "string"){validate11.errors = [{instancePath:instancePath+"/attributes/MessageGroupId",schemaPath:"#/$defs/SqsAttributesSchema/properties/MessageGroupId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs18 === errors;}else {var valid3 = true;}if(valid3){if(data3.SenderId !== undefined){const _errs20 = errors;if(typeof data3.SenderId !== "string"){validate11.errors = [{instancePath:instancePath+"/attributes/SenderId",schemaPath:"#/$defs/SqsAttributesSchema/properties/SenderId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs20 === errors;}else {var valid3 = true;}if(valid3){if(data3.SentTimestamp !== undefined){const _errs22 = errors;if(typeof data3.SentTimestamp !== "string"){validate11.errors = [{instancePath:instancePath+"/attributes/SentTimestamp",schemaPath:"#/$defs/SqsAttributesSchema/properties/SentTimestamp/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs22 === errors;}else {var valid3 = true;}if(valid3){if(data3.SequenceNumber !== undefined){const _errs24 = errors;if(typeof data3.SequenceNumber !== "string"){validate11.errors = [{instancePath:instancePath+"/attributes/SequenceNumber",schemaPath:"#/$defs/SqsAttributesSchema/properties/SequenceNumber/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs24 === errors;}else {var valid3 = true;}if(valid3){if(data3.AWSTraceHeader !== undefined){const _errs26 = errors;if(typeof data3.AWSTraceHeader !== "string"){validate11.errors = [{instancePath:instancePath+"/attributes/AWSTraceHeader",schemaPath:"#/$defs/SqsAttributesSchema/properties/AWSTraceHeader/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs26 === errors;}else {var valid3 = true;}if(valid3){if(data3.DeadLetterQueueSourceArn !== undefined){const _errs28 = errors;if(typeof data3.DeadLetterQueueSourceArn !== "string"){validate11.errors = [{instancePath:instancePath+"/attributes/DeadLetterQueueSourceArn",schemaPath:"#/$defs/SqsAttributesSchema/properties/DeadLetterQueueSourceArn/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs28 === errors;}else {var valid3 = true;}}}}}}}}}}}else {validate11.errors = [{instancePath:instancePath+"/attributes",schemaPath:"#/$defs/SqsAttributesSchema/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs8 === errors;}else {var valid1 = true;}if(valid1){if(data.messageAttributes !== undefined){let data13 = data.messageAttributes;const _errs30 = errors;if(errors === _errs30){if(data13 && typeof data13 == "object" && !Array.isArray(data13)){for(const key0 in data13){let data14 = data13[key0];const _errs33 = errors;const _errs34 = errors;if(errors === _errs34){if(data14 && typeof data14 == "object" && !Array.isArray(data14)){let missing2;if((data14.dataType === undefined) && (missing2 = "dataType")){validate11.errors = [{instancePath:instancePath+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/SqsMsgAttributeSchema/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];return false;}else {if(data14.stringValue !== undefined){const _errs37 = errors;if(typeof data14.stringValue !== "string"){validate11.errors = [{instancePath:instancePath+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/stringValue",schemaPath:"#/$defs/SqsMsgAttributeSchema/properties/stringValue/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid6 = _errs37 === errors;}else {var valid6 = true;}if(valid6){if(data14.binaryValue !== undefined){const _errs39 = errors;if(typeof data14.binaryValue !== "string"){validate11.errors = [{instancePath:instancePath+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/binaryValue",schemaPath:"#/$defs/SqsMsgAttributeSchema/properties/binaryValue/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid6 = _errs39 === errors;}else {var valid6 = true;}if(valid6){if(data14.stringListValues !== undefined){let data17 = data14.stringListValues;const _errs41 = errors;if(errors === _errs41){if(Array.isArray(data17)){var valid7 = true;const len0 = data17.length;for(let i0=0; i0<len0; i0++){const _errs43 = errors;if(typeof data17[i0] !== "string"){validate11.errors = [{instancePath:instancePath+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/stringListValues/" + i0,schemaPath:"#/$defs/SqsMsgAttributeSchema/properties/stringListValues/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid7 = _errs43 === errors;if(!valid7){break;}}}else {validate11.errors = [{instancePath:instancePath+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/stringListValues",schemaPath:"#/$defs/SqsMsgAttributeSchema/properties/stringListValues/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid6 = _errs41 === errors;}else {var valid6 = true;}if(valid6){if(data14.binaryListValues !== undefined){let data19 = data14.binaryListValues;const _errs45 = errors;if(errors === _errs45){if(Array.isArray(data19)){var valid8 = true;const len1 = data19.length;for(let i1=0; i1<len1; i1++){const _errs47 = errors;if(typeof data19[i1] !== "string"){validate11.errors = [{instancePath:instancePath+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/binaryListValues/" + i1,schemaPath:"#/$defs/SqsMsgAttributeSchema/properties/binaryListValues/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid8 = _errs47 === errors;if(!valid8){break;}}}else {validate11.errors = [{instancePath:instancePath+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/binaryListValues",schemaPath:"#/$defs/SqsMsgAttributeSchema/properties/binaryListValues/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid6 = _errs45 === errors;}else {var valid6 = true;}if(valid6){if(data14.dataType !== undefined){const _errs49 = errors;if(typeof data14.dataType !== "string"){validate11.errors = [{instancePath:instancePath+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/dataType",schemaPath:"#/$defs/SqsMsgAttributeSchema/properties/dataType/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid6 = _errs49 === errors;}else {var valid6 = true;}}}}}}}else {validate11.errors = [{instancePath:instancePath+"/messageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/SqsMsgAttributeSchema/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid4 = _errs33 === errors;if(!valid4){break;}}}else {validate11.errors = [{instancePath:instancePath+"/messageAttributes",schemaPath:"#/properties/messageAttributes/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs30 === errors;}else {var valid1 = true;}if(valid1){if(data.md5OfBody !== undefined){const _errs51 = errors;if(typeof data.md5OfBody !== "string"){validate11.errors = [{instancePath:instancePath+"/md5OfBody",schemaPath:"#/properties/md5OfBody/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs51 === errors;}else {var valid1 = true;}if(valid1){if(data.md5OfMessageAttributes !== undefined){let data23 = data.md5OfMessageAttributes;const _errs53 = errors;if((typeof data23 !== "string") && (data23 !== null)){validate11.errors = [{instancePath:instancePath+"/md5OfMessageAttributes",schemaPath:"#/properties/md5OfMessageAttributes/type",keyword:"type",params:{type: schema12.properties.md5OfMessageAttributes.type},message:"must be string,null"}];return false;}var valid1 = _errs53 === errors;}else {var valid1 = true;}if(valid1){if(data.eventSource !== undefined){const _errs55 = errors;if("aws:sqs" !== data.eventSource){validate11.errors = [{instancePath:instancePath+"/eventSource",schemaPath:"#/properties/eventSource/const",keyword:"const",params:{allowedValue: "aws:sqs"},message:"must be equal to constant"}];return false;}var valid1 = _errs55 === errors;}else {var valid1 = true;}if(valid1){if(data.eventSourceARN !== undefined){const _errs56 = errors;if(typeof data.eventSourceARN !== "string"){validate11.errors = [{instancePath:instancePath+"/eventSourceARN",schemaPath:"#/properties/eventSourceARN/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs56 === errors;}else {var valid1 = true;}if(valid1){if(data.awsRegion !== undefined){const _errs58 = errors;if(typeof data.awsRegion !== "string"){validate11.errors = [{instancePath:instancePath+"/awsRegion",schemaPath:"#/properties/awsRegion/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs58 === errors;}else {var valid1 = true;}}}}}}}}}}}}else {validate11.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate11.errors = vErrors;return errors === 0;}function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((data.Records === undefined) && (missing0 = "Records")){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.Records !== undefined){let data0 = data.Records;const _errs2 = errors;if(errors === _errs2){if(Array.isArray(data0)){var valid1 = true;const len0 = data0.length;for(let i0=0; i0<len0; i0++){const _errs4 = errors;if(!(validate11(data0[i0], {instancePath:instancePath+"/Records/" + i0,parentData:data0,parentDataProperty:i0,rootData}))){vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);errors = vErrors.length;}var valid1 = _errs4 === errors;if(!valid1){break;}}}else {validate10.errors = [{instancePath:instancePath+"/Records",schemaPath:"#/properties/Records/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;