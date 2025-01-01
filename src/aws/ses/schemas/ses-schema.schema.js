/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
import { fullFormats as ajvFormatsDistFormatsFullFormats } from 'ajv-formats/dist/formats.js';
"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"SesSchema","type":"object","properties":{"Records":{"type":"array","items":{"$ref":"#/$defs/SesRecordSchema"}}},"required":["Records"],"additionalProperties":true,"$defs":{"SesRecordSchema":{"type":"object","properties":{"eventSource":{"const":"aws:ses"},"eventVersion":{"type":"string"},"ses":{"$ref":"#/$defs/SesMessage"}},"required":["eventSource","eventVersion","ses"],"additionalProperties":true},"SesMessage":{"type":"object","properties":{"mail":{"$ref":"#/$defs/SesMail"},"receipt":{"$ref":"#/$defs/SesReceipt"}},"required":["mail","receipt"],"additionalProperties":true},"SesMail":{"type":"object","properties":{"timestamp":{"type":"string","format":"date-time"},"source":{"type":"string"},"messageId":{"type":"string"},"destination":{"type":"array","items":{"type":"string"}},"headersTruncated":{"type":"boolean"},"headers":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"value":{"type":"string"}},"required":["name","value"],"additionalProperties":true}},"commonHeaders":{"type":"object","properties":{"from":{"type":"array","items":{"type":"string"}},"to":{"type":"array","items":{"type":"string"}},"cc":{"type":"array","items":{"type":"string"}},"bcc":{"type":"array","items":{"type":"string"}},"sender":{"type":"array","items":{"type":"string"}},"reply-to":{"type":"array","items":{"type":"string"}},"returnPath":{"type":"string"},"messageId":{"type":"string"},"date":{"type":"string"},"subject":{"type":"string"}},"required":["date","from","messageId","returnPath","subject","to"],"additionalProperties":true}},"required":["commonHeaders","destination","headers","headersTruncated","messageId","source","timestamp"],"additionalProperties":true},"SesReceipt":{"type":"object","properties":{"timestamp":{"type":"string","format":"date-time"},"processingTimeMillis":{"type":"integer","exclusiveMinimum":0},"recipients":{"type":"array","items":{"type":"string"}},"spamVerdict":{"$ref":"#/$defs/SesReceiptVerdict"},"virusVerdict":{"$ref":"#/$defs/SesReceiptVerdict"},"spfVerdict":{"$ref":"#/$defs/SesReceiptVerdict"},"dmarcVerdict":{"$ref":"#/$defs/SesReceiptVerdict"},"dkimVerdict":{"$ref":"#/$defs/SesReceiptVerdict"},"dmarcPolicy":{"enum":["none","quarantine","reject"]},"action":{"type":"object","properties":{"type":{"enum":["Lambda"]},"invocationType":{"const":"Event"},"functionArn":{"type":"string"}},"required":["functionArn","invocationType","type"],"additionalProperties":true}},"required":["action","dkimVerdict","dmarcPolicy","dmarcVerdict","processingTimeMillis","recipients","spamVerdict","spfVerdict","timestamp","virusVerdict"],"additionalProperties":true},"SesReceiptVerdict":{"type":"object","properties":{"status":{"enum":["PASS","FAIL","GRAY","PROCESSING_FAILED"]}},"required":["status"],"additionalProperties":true}}};const schema12 = {"type":"object","properties":{"eventSource":{"const":"aws:ses"},"eventVersion":{"type":"string"},"ses":{"$ref":"#/$defs/SesMessage"}},"required":["eventSource","eventVersion","ses"],"additionalProperties":true};const schema13 = {"type":"object","properties":{"mail":{"$ref":"#/$defs/SesMail"},"receipt":{"$ref":"#/$defs/SesReceipt"}},"required":["mail","receipt"],"additionalProperties":true};const schema14 = {"type":"object","properties":{"timestamp":{"type":"string","format":"date-time"},"source":{"type":"string"},"messageId":{"type":"string"},"destination":{"type":"array","items":{"type":"string"}},"headersTruncated":{"type":"boolean"},"headers":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"value":{"type":"string"}},"required":["name","value"],"additionalProperties":true}},"commonHeaders":{"type":"object","properties":{"from":{"type":"array","items":{"type":"string"}},"to":{"type":"array","items":{"type":"string"}},"cc":{"type":"array","items":{"type":"string"}},"bcc":{"type":"array","items":{"type":"string"}},"sender":{"type":"array","items":{"type":"string"}},"reply-to":{"type":"array","items":{"type":"string"}},"returnPath":{"type":"string"},"messageId":{"type":"string"},"date":{"type":"string"},"subject":{"type":"string"}},"required":["date","from","messageId","returnPath","subject","to"],"additionalProperties":true}},"required":["commonHeaders","destination","headers","headersTruncated","messageId","source","timestamp"],"additionalProperties":true};const formats0 = ajvFormatsDistFormatsFullFormats["date-time"];const schema15 = {"type":"object","properties":{"timestamp":{"type":"string","format":"date-time"},"processingTimeMillis":{"type":"integer","exclusiveMinimum":0},"recipients":{"type":"array","items":{"type":"string"}},"spamVerdict":{"$ref":"#/$defs/SesReceiptVerdict"},"virusVerdict":{"$ref":"#/$defs/SesReceiptVerdict"},"spfVerdict":{"$ref":"#/$defs/SesReceiptVerdict"},"dmarcVerdict":{"$ref":"#/$defs/SesReceiptVerdict"},"dkimVerdict":{"$ref":"#/$defs/SesReceiptVerdict"},"dmarcPolicy":{"enum":["none","quarantine","reject"]},"action":{"type":"object","properties":{"type":{"enum":["Lambda"]},"invocationType":{"const":"Event"},"functionArn":{"type":"string"}},"required":["functionArn","invocationType","type"],"additionalProperties":true}},"required":["action","dkimVerdict","dmarcPolicy","dmarcVerdict","processingTimeMillis","recipients","spamVerdict","spfVerdict","timestamp","virusVerdict"],"additionalProperties":true};const schema16 = {"type":"object","properties":{"status":{"enum":["PASS","FAIL","GRAY","PROCESSING_FAILED"]}},"required":["status"],"additionalProperties":true};function validate13(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;let valid0 = true;for( missing0 of schema15.required){valid0 = data[missing0] !== undefined;if(!valid0){validate13.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;break;}}if(valid0){if(data.timestamp !== undefined){let data0 = data.timestamp;const _errs2 = errors;if(errors === _errs2){if(errors === _errs2){if(typeof data0 === "string"){if(!(formats0.validate(data0))){validate13.errors = [{instancePath:instancePath+"/timestamp",schemaPath:"#/properties/timestamp/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""}];return false;}}else {validate13.errors = [{instancePath:instancePath+"/timestamp",schemaPath:"#/properties/timestamp/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}var valid1 = _errs2 === errors;}else {var valid1 = true;}if(valid1){if(data.processingTimeMillis !== undefined){let data1 = data.processingTimeMillis;const _errs4 = errors;if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){validate13.errors = [{instancePath:instancePath+"/processingTimeMillis",schemaPath:"#/properties/processingTimeMillis/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];return false;}if(errors === _errs4){if((typeof data1 == "number") && (isFinite(data1))){if(data1 <= 0 || isNaN(data1)){validate13.errors = [{instancePath:instancePath+"/processingTimeMillis",schemaPath:"#/properties/processingTimeMillis/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"}];return false;}}}var valid1 = _errs4 === errors;}else {var valid1 = true;}if(valid1){if(data.recipients !== undefined){let data2 = data.recipients;const _errs6 = errors;if(errors === _errs6){if(Array.isArray(data2)){var valid2 = true;const len0 = data2.length;for(let i0=0; i0<len0; i0++){const _errs8 = errors;if(typeof data2[i0] !== "string"){validate13.errors = [{instancePath:instancePath+"/recipients/" + i0,schemaPath:"#/properties/recipients/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid2 = _errs8 === errors;if(!valid2){break;}}}else {validate13.errors = [{instancePath:instancePath+"/recipients",schemaPath:"#/properties/recipients/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid1 = _errs6 === errors;}else {var valid1 = true;}if(valid1){if(data.spamVerdict !== undefined){let data4 = data.spamVerdict;const _errs10 = errors;const _errs11 = errors;if(errors === _errs11){if(data4 && typeof data4 == "object" && !Array.isArray(data4)){let missing1;if((data4.status === undefined) && (missing1 = "status")){validate13.errors = [{instancePath:instancePath+"/spamVerdict",schemaPath:"#/$defs/SesReceiptVerdict/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];return false;}else {if(data4.status !== undefined){let data5 = data4.status;if(!((((data5 === "PASS") || (data5 === "FAIL")) || (data5 === "GRAY")) || (data5 === "PROCESSING_FAILED"))){validate13.errors = [{instancePath:instancePath+"/spamVerdict/status",schemaPath:"#/$defs/SesReceiptVerdict/properties/status/enum",keyword:"enum",params:{allowedValues: schema16.properties.status.enum},message:"must be equal to one of the allowed values"}];return false;}}}}else {validate13.errors = [{instancePath:instancePath+"/spamVerdict",schemaPath:"#/$defs/SesReceiptVerdict/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs10 === errors;}else {var valid1 = true;}if(valid1){if(data.virusVerdict !== undefined){let data6 = data.virusVerdict;const _errs15 = errors;const _errs16 = errors;if(errors === _errs16){if(data6 && typeof data6 == "object" && !Array.isArray(data6)){let missing2;if((data6.status === undefined) && (missing2 = "status")){validate13.errors = [{instancePath:instancePath+"/virusVerdict",schemaPath:"#/$defs/SesReceiptVerdict/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];return false;}else {if(data6.status !== undefined){let data7 = data6.status;if(!((((data7 === "PASS") || (data7 === "FAIL")) || (data7 === "GRAY")) || (data7 === "PROCESSING_FAILED"))){validate13.errors = [{instancePath:instancePath+"/virusVerdict/status",schemaPath:"#/$defs/SesReceiptVerdict/properties/status/enum",keyword:"enum",params:{allowedValues: schema16.properties.status.enum},message:"must be equal to one of the allowed values"}];return false;}}}}else {validate13.errors = [{instancePath:instancePath+"/virusVerdict",schemaPath:"#/$defs/SesReceiptVerdict/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs15 === errors;}else {var valid1 = true;}if(valid1){if(data.spfVerdict !== undefined){let data8 = data.spfVerdict;const _errs20 = errors;const _errs21 = errors;if(errors === _errs21){if(data8 && typeof data8 == "object" && !Array.isArray(data8)){let missing3;if((data8.status === undefined) && (missing3 = "status")){validate13.errors = [{instancePath:instancePath+"/spfVerdict",schemaPath:"#/$defs/SesReceiptVerdict/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"}];return false;}else {if(data8.status !== undefined){let data9 = data8.status;if(!((((data9 === "PASS") || (data9 === "FAIL")) || (data9 === "GRAY")) || (data9 === "PROCESSING_FAILED"))){validate13.errors = [{instancePath:instancePath+"/spfVerdict/status",schemaPath:"#/$defs/SesReceiptVerdict/properties/status/enum",keyword:"enum",params:{allowedValues: schema16.properties.status.enum},message:"must be equal to one of the allowed values"}];return false;}}}}else {validate13.errors = [{instancePath:instancePath+"/spfVerdict",schemaPath:"#/$defs/SesReceiptVerdict/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs20 === errors;}else {var valid1 = true;}if(valid1){if(data.dmarcVerdict !== undefined){let data10 = data.dmarcVerdict;const _errs25 = errors;const _errs26 = errors;if(errors === _errs26){if(data10 && typeof data10 == "object" && !Array.isArray(data10)){let missing4;if((data10.status === undefined) && (missing4 = "status")){validate13.errors = [{instancePath:instancePath+"/dmarcVerdict",schemaPath:"#/$defs/SesReceiptVerdict/required",keyword:"required",params:{missingProperty: missing4},message:"must have required property '"+missing4+"'"}];return false;}else {if(data10.status !== undefined){let data11 = data10.status;if(!((((data11 === "PASS") || (data11 === "FAIL")) || (data11 === "GRAY")) || (data11 === "PROCESSING_FAILED"))){validate13.errors = [{instancePath:instancePath+"/dmarcVerdict/status",schemaPath:"#/$defs/SesReceiptVerdict/properties/status/enum",keyword:"enum",params:{allowedValues: schema16.properties.status.enum},message:"must be equal to one of the allowed values"}];return false;}}}}else {validate13.errors = [{instancePath:instancePath+"/dmarcVerdict",schemaPath:"#/$defs/SesReceiptVerdict/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs25 === errors;}else {var valid1 = true;}if(valid1){if(data.dkimVerdict !== undefined){let data12 = data.dkimVerdict;const _errs30 = errors;const _errs31 = errors;if(errors === _errs31){if(data12 && typeof data12 == "object" && !Array.isArray(data12)){let missing5;if((data12.status === undefined) && (missing5 = "status")){validate13.errors = [{instancePath:instancePath+"/dkimVerdict",schemaPath:"#/$defs/SesReceiptVerdict/required",keyword:"required",params:{missingProperty: missing5},message:"must have required property '"+missing5+"'"}];return false;}else {if(data12.status !== undefined){let data13 = data12.status;if(!((((data13 === "PASS") || (data13 === "FAIL")) || (data13 === "GRAY")) || (data13 === "PROCESSING_FAILED"))){validate13.errors = [{instancePath:instancePath+"/dkimVerdict/status",schemaPath:"#/$defs/SesReceiptVerdict/properties/status/enum",keyword:"enum",params:{allowedValues: schema16.properties.status.enum},message:"must be equal to one of the allowed values"}];return false;}}}}else {validate13.errors = [{instancePath:instancePath+"/dkimVerdict",schemaPath:"#/$defs/SesReceiptVerdict/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs30 === errors;}else {var valid1 = true;}if(valid1){if(data.dmarcPolicy !== undefined){let data14 = data.dmarcPolicy;const _errs35 = errors;if(!(((data14 === "none") || (data14 === "quarantine")) || (data14 === "reject"))){validate13.errors = [{instancePath:instancePath+"/dmarcPolicy",schemaPath:"#/properties/dmarcPolicy/enum",keyword:"enum",params:{allowedValues: schema15.properties.dmarcPolicy.enum},message:"must be equal to one of the allowed values"}];return false;}var valid1 = _errs35 === errors;}else {var valid1 = true;}if(valid1){if(data.action !== undefined){let data15 = data.action;const _errs36 = errors;if(errors === _errs36){if(data15 && typeof data15 == "object" && !Array.isArray(data15)){let missing6;if((((data15.functionArn === undefined) && (missing6 = "functionArn")) || ((data15.invocationType === undefined) && (missing6 = "invocationType"))) || ((data15.type === undefined) && (missing6 = "type"))){validate13.errors = [{instancePath:instancePath+"/action",schemaPath:"#/properties/action/required",keyword:"required",params:{missingProperty: missing6},message:"must have required property '"+missing6+"'"}];return false;}else {if(data15.type !== undefined){const _errs39 = errors;if(!(data15.type === "Lambda")){validate13.errors = [{instancePath:instancePath+"/action/type",schemaPath:"#/properties/action/properties/type/enum",keyword:"enum",params:{allowedValues: schema15.properties.action.properties.type.enum},message:"must be equal to one of the allowed values"}];return false;}var valid13 = _errs39 === errors;}else {var valid13 = true;}if(valid13){if(data15.invocationType !== undefined){const _errs40 = errors;if("Event" !== data15.invocationType){validate13.errors = [{instancePath:instancePath+"/action/invocationType",schemaPath:"#/properties/action/properties/invocationType/const",keyword:"const",params:{allowedValue: "Event"},message:"must be equal to constant"}];return false;}var valid13 = _errs40 === errors;}else {var valid13 = true;}if(valid13){if(data15.functionArn !== undefined){const _errs41 = errors;if(typeof data15.functionArn !== "string"){validate13.errors = [{instancePath:instancePath+"/action/functionArn",schemaPath:"#/properties/action/properties/functionArn/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid13 = _errs41 === errors;}else {var valid13 = true;}}}}}else {validate13.errors = [{instancePath:instancePath+"/action",schemaPath:"#/properties/action/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs36 === errors;}else {var valid1 = true;}}}}}}}}}}}}else {validate13.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate13.errors = vErrors;return errors === 0;}function validate12(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if(((data.mail === undefined) && (missing0 = "mail")) || ((data.receipt === undefined) && (missing0 = "receipt"))){validate12.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.mail !== undefined){let data0 = data.mail;const _errs2 = errors;const _errs3 = errors;if(errors === _errs3){if(data0 && typeof data0 == "object" && !Array.isArray(data0)){let missing1;let valid2 = true;for( missing1 of schema14.required){valid2 = data0[missing1] !== undefined;if(!valid2){validate12.errors = [{instancePath:instancePath+"/mail",schemaPath:"#/$defs/SesMail/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];return false;break;}}if(valid2){if(data0.timestamp !== undefined){let data1 = data0.timestamp;const _errs6 = errors;if(errors === _errs6){if(errors === _errs6){if(typeof data1 === "string"){if(!(formats0.validate(data1))){validate12.errors = [{instancePath:instancePath+"/mail/timestamp",schemaPath:"#/$defs/SesMail/properties/timestamp/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""}];return false;}}else {validate12.errors = [{instancePath:instancePath+"/mail/timestamp",schemaPath:"#/$defs/SesMail/properties/timestamp/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}var valid3 = _errs6 === errors;}else {var valid3 = true;}if(valid3){if(data0.source !== undefined){const _errs8 = errors;if(typeof data0.source !== "string"){validate12.errors = [{instancePath:instancePath+"/mail/source",schemaPath:"#/$defs/SesMail/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs8 === errors;}else {var valid3 = true;}if(valid3){if(data0.messageId !== undefined){const _errs10 = errors;if(typeof data0.messageId !== "string"){validate12.errors = [{instancePath:instancePath+"/mail/messageId",schemaPath:"#/$defs/SesMail/properties/messageId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs10 === errors;}else {var valid3 = true;}if(valid3){if(data0.destination !== undefined){let data4 = data0.destination;const _errs12 = errors;if(errors === _errs12){if(Array.isArray(data4)){var valid4 = true;const len0 = data4.length;for(let i0=0; i0<len0; i0++){const _errs14 = errors;if(typeof data4[i0] !== "string"){validate12.errors = [{instancePath:instancePath+"/mail/destination/" + i0,schemaPath:"#/$defs/SesMail/properties/destination/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs14 === errors;if(!valid4){break;}}}else {validate12.errors = [{instancePath:instancePath+"/mail/destination",schemaPath:"#/$defs/SesMail/properties/destination/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid3 = _errs12 === errors;}else {var valid3 = true;}if(valid3){if(data0.headersTruncated !== undefined){const _errs16 = errors;if(typeof data0.headersTruncated !== "boolean"){validate12.errors = [{instancePath:instancePath+"/mail/headersTruncated",schemaPath:"#/$defs/SesMail/properties/headersTruncated/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];return false;}var valid3 = _errs16 === errors;}else {var valid3 = true;}if(valid3){if(data0.headers !== undefined){let data7 = data0.headers;const _errs18 = errors;if(errors === _errs18){if(Array.isArray(data7)){var valid5 = true;const len1 = data7.length;for(let i1=0; i1<len1; i1++){let data8 = data7[i1];const _errs20 = errors;if(errors === _errs20){if(data8 && typeof data8 == "object" && !Array.isArray(data8)){let missing2;if(((data8.name === undefined) && (missing2 = "name")) || ((data8.value === undefined) && (missing2 = "value"))){validate12.errors = [{instancePath:instancePath+"/mail/headers/" + i1,schemaPath:"#/$defs/SesMail/properties/headers/items/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];return false;}else {if(data8.name !== undefined){const _errs23 = errors;if(typeof data8.name !== "string"){validate12.errors = [{instancePath:instancePath+"/mail/headers/" + i1+"/name",schemaPath:"#/$defs/SesMail/properties/headers/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid6 = _errs23 === errors;}else {var valid6 = true;}if(valid6){if(data8.value !== undefined){const _errs25 = errors;if(typeof data8.value !== "string"){validate12.errors = [{instancePath:instancePath+"/mail/headers/" + i1+"/value",schemaPath:"#/$defs/SesMail/properties/headers/items/properties/value/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid6 = _errs25 === errors;}else {var valid6 = true;}}}}else {validate12.errors = [{instancePath:instancePath+"/mail/headers/" + i1,schemaPath:"#/$defs/SesMail/properties/headers/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid5 = _errs20 === errors;if(!valid5){break;}}}else {validate12.errors = [{instancePath:instancePath+"/mail/headers",schemaPath:"#/$defs/SesMail/properties/headers/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid3 = _errs18 === errors;}else {var valid3 = true;}if(valid3){if(data0.commonHeaders !== undefined){let data11 = data0.commonHeaders;const _errs27 = errors;if(errors === _errs27){if(data11 && typeof data11 == "object" && !Array.isArray(data11)){let missing3;let valid7 = true;for( missing3 of schema14.properties.commonHeaders.required){valid7 = data11[missing3] !== undefined;if(!valid7){validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders",schemaPath:"#/$defs/SesMail/properties/commonHeaders/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"}];return false;break;}}if(valid7){if(data11.from !== undefined){let data12 = data11.from;const _errs30 = errors;if(errors === _errs30){if(Array.isArray(data12)){var valid9 = true;const len2 = data12.length;for(let i2=0; i2<len2; i2++){const _errs32 = errors;if(typeof data12[i2] !== "string"){validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders/from/" + i2,schemaPath:"#/$defs/SesMail/properties/commonHeaders/properties/from/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid9 = _errs32 === errors;if(!valid9){break;}}}else {validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders/from",schemaPath:"#/$defs/SesMail/properties/commonHeaders/properties/from/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid8 = _errs30 === errors;}else {var valid8 = true;}if(valid8){if(data11.to !== undefined){let data14 = data11.to;const _errs34 = errors;if(errors === _errs34){if(Array.isArray(data14)){var valid10 = true;const len3 = data14.length;for(let i3=0; i3<len3; i3++){const _errs36 = errors;if(typeof data14[i3] !== "string"){validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders/to/" + i3,schemaPath:"#/$defs/SesMail/properties/commonHeaders/properties/to/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid10 = _errs36 === errors;if(!valid10){break;}}}else {validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders/to",schemaPath:"#/$defs/SesMail/properties/commonHeaders/properties/to/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid8 = _errs34 === errors;}else {var valid8 = true;}if(valid8){if(data11.cc !== undefined){let data16 = data11.cc;const _errs38 = errors;if(errors === _errs38){if(Array.isArray(data16)){var valid11 = true;const len4 = data16.length;for(let i4=0; i4<len4; i4++){const _errs40 = errors;if(typeof data16[i4] !== "string"){validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders/cc/" + i4,schemaPath:"#/$defs/SesMail/properties/commonHeaders/properties/cc/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid11 = _errs40 === errors;if(!valid11){break;}}}else {validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders/cc",schemaPath:"#/$defs/SesMail/properties/commonHeaders/properties/cc/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid8 = _errs38 === errors;}else {var valid8 = true;}if(valid8){if(data11.bcc !== undefined){let data18 = data11.bcc;const _errs42 = errors;if(errors === _errs42){if(Array.isArray(data18)){var valid12 = true;const len5 = data18.length;for(let i5=0; i5<len5; i5++){const _errs44 = errors;if(typeof data18[i5] !== "string"){validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders/bcc/" + i5,schemaPath:"#/$defs/SesMail/properties/commonHeaders/properties/bcc/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid12 = _errs44 === errors;if(!valid12){break;}}}else {validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders/bcc",schemaPath:"#/$defs/SesMail/properties/commonHeaders/properties/bcc/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid8 = _errs42 === errors;}else {var valid8 = true;}if(valid8){if(data11.sender !== undefined){let data20 = data11.sender;const _errs46 = errors;if(errors === _errs46){if(Array.isArray(data20)){var valid13 = true;const len6 = data20.length;for(let i6=0; i6<len6; i6++){const _errs48 = errors;if(typeof data20[i6] !== "string"){validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders/sender/" + i6,schemaPath:"#/$defs/SesMail/properties/commonHeaders/properties/sender/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid13 = _errs48 === errors;if(!valid13){break;}}}else {validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders/sender",schemaPath:"#/$defs/SesMail/properties/commonHeaders/properties/sender/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid8 = _errs46 === errors;}else {var valid8 = true;}if(valid8){if(data11["reply-to"] !== undefined){let data22 = data11["reply-to"];const _errs50 = errors;if(errors === _errs50){if(Array.isArray(data22)){var valid14 = true;const len7 = data22.length;for(let i7=0; i7<len7; i7++){const _errs52 = errors;if(typeof data22[i7] !== "string"){validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders/reply-to/" + i7,schemaPath:"#/$defs/SesMail/properties/commonHeaders/properties/reply-to/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid14 = _errs52 === errors;if(!valid14){break;}}}else {validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders/reply-to",schemaPath:"#/$defs/SesMail/properties/commonHeaders/properties/reply-to/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid8 = _errs50 === errors;}else {var valid8 = true;}if(valid8){if(data11.returnPath !== undefined){const _errs54 = errors;if(typeof data11.returnPath !== "string"){validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders/returnPath",schemaPath:"#/$defs/SesMail/properties/commonHeaders/properties/returnPath/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid8 = _errs54 === errors;}else {var valid8 = true;}if(valid8){if(data11.messageId !== undefined){const _errs56 = errors;if(typeof data11.messageId !== "string"){validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders/messageId",schemaPath:"#/$defs/SesMail/properties/commonHeaders/properties/messageId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid8 = _errs56 === errors;}else {var valid8 = true;}if(valid8){if(data11.date !== undefined){const _errs58 = errors;if(typeof data11.date !== "string"){validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders/date",schemaPath:"#/$defs/SesMail/properties/commonHeaders/properties/date/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid8 = _errs58 === errors;}else {var valid8 = true;}if(valid8){if(data11.subject !== undefined){const _errs60 = errors;if(typeof data11.subject !== "string"){validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders/subject",schemaPath:"#/$defs/SesMail/properties/commonHeaders/properties/subject/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid8 = _errs60 === errors;}else {var valid8 = true;}}}}}}}}}}}}else {validate12.errors = [{instancePath:instancePath+"/mail/commonHeaders",schemaPath:"#/$defs/SesMail/properties/commonHeaders/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid3 = _errs27 === errors;}else {var valid3 = true;}}}}}}}}}else {validate12.errors = [{instancePath:instancePath+"/mail",schemaPath:"#/$defs/SesMail/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.receipt !== undefined){const _errs62 = errors;if(!(validate13(data.receipt, {instancePath:instancePath+"/receipt",parentData:data,parentDataProperty:"receipt",rootData}))){vErrors = vErrors === null ? validate13.errors : vErrors.concat(validate13.errors);errors = vErrors.length;}var valid0 = _errs62 === errors;}else {var valid0 = true;}}}}else {validate12.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate12.errors = vErrors;return errors === 0;}function validate11(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((((data.eventSource === undefined) && (missing0 = "eventSource")) || ((data.eventVersion === undefined) && (missing0 = "eventVersion"))) || ((data.ses === undefined) && (missing0 = "ses"))){validate11.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.eventSource !== undefined){const _errs2 = errors;if("aws:ses" !== data.eventSource){validate11.errors = [{instancePath:instancePath+"/eventSource",schemaPath:"#/properties/eventSource/const",keyword:"const",params:{allowedValue: "aws:ses"},message:"must be equal to constant"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.eventVersion !== undefined){const _errs3 = errors;if(typeof data.eventVersion !== "string"){validate11.errors = [{instancePath:instancePath+"/eventVersion",schemaPath:"#/properties/eventVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs3 === errors;}else {var valid0 = true;}if(valid0){if(data.ses !== undefined){const _errs5 = errors;if(!(validate12(data.ses, {instancePath:instancePath+"/ses",parentData:data,parentDataProperty:"ses",rootData}))){vErrors = vErrors === null ? validate12.errors : vErrors.concat(validate12.errors);errors = vErrors.length;}var valid0 = _errs5 === errors;}else {var valid0 = true;}}}}}else {validate11.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate11.errors = vErrors;return errors === 0;}function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((data.Records === undefined) && (missing0 = "Records")){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.Records !== undefined){let data0 = data.Records;const _errs2 = errors;if(errors === _errs2){if(Array.isArray(data0)){var valid1 = true;const len0 = data0.length;for(let i0=0; i0<len0; i0++){const _errs4 = errors;if(!(validate11(data0[i0], {instancePath:instancePath+"/Records/" + i0,parentData:data0,parentDataProperty:i0,rootData}))){vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);errors = vErrors.length;}var valid1 = _errs4 === errors;if(!valid1){break;}}}else {validate10.errors = [{instancePath:instancePath+"/Records",schemaPath:"#/properties/Records/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;