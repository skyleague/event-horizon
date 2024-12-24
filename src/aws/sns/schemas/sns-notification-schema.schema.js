/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
import { fullFormats as ajvFormatsDistFormatsFullFormats } from 'ajv-formats/dist/formats.js';
"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"SnsNotificationSchema","type":"object","properties":{"Subject":{"type":["string","null"]},"TopicArn":{"type":"string"},"UnsubscribeUrl":{"type":"string","format":"uri"},"UnsubscribeURL":{"type":"string","format":"uri"},"SigningCertUrl":{"type":"string","format":"uri"},"SigningCertURL":{"type":"string","format":"uri"},"Type":{"const":"Notification"},"MessageAttributes":{"type":"object","additionalProperties":{"$ref":"#/$defs/SnsMsgAttribute"}},"Message":{"type":"string"},"MessageId":{"type":"string"},"Signature":{"type":"string"},"SignatureVersion":{"type":"string"},"Timestamp":{"type":"string","format":"date-time"}},"required":["Message","MessageId","Timestamp","TopicArn","Type","UnsubscribeUrl"],"additionalProperties":true,"$defs":{"SnsMsgAttribute":{"type":"object","properties":{"Type":{"type":"string"},"Value":{"type":"string"}},"required":["Type","Value"],"additionalProperties":true}}};const schema12 = {"type":"object","properties":{"Type":{"type":"string"},"Value":{"type":"string"}},"required":["Type","Value"],"additionalProperties":true};const formats0 = ajvFormatsDistFormatsFullFormats.uri;const formats8 = ajvFormatsDistFormatsFullFormats["date-time"];function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;let valid0 = true;for( missing0 of schema11.required){valid0 = data[missing0] !== undefined;if(!valid0){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;break;}}if(valid0){if(data.Subject !== undefined){let data0 = data.Subject;const _errs2 = errors;if((typeof data0 !== "string") && (data0 !== null)){validate10.errors = [{instancePath:instancePath+"/Subject",schemaPath:"#/properties/Subject/type",keyword:"type",params:{type: schema11.properties.Subject.type},message:"must be string,null"}];return false;}var valid1 = _errs2 === errors;}else {var valid1 = true;}if(valid1){if(data.TopicArn !== undefined){const _errs4 = errors;if(typeof data.TopicArn !== "string"){validate10.errors = [{instancePath:instancePath+"/TopicArn",schemaPath:"#/properties/TopicArn/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs4 === errors;}else {var valid1 = true;}if(valid1){if(data.UnsubscribeUrl !== undefined){let data2 = data.UnsubscribeUrl;const _errs6 = errors;if(errors === _errs6){if(errors === _errs6){if(typeof data2 === "string"){if(!(formats0(data2))){validate10.errors = [{instancePath:instancePath+"/UnsubscribeUrl",schemaPath:"#/properties/UnsubscribeUrl/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""}];return false;}}else {validate10.errors = [{instancePath:instancePath+"/UnsubscribeUrl",schemaPath:"#/properties/UnsubscribeUrl/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}var valid1 = _errs6 === errors;}else {var valid1 = true;}if(valid1){if(data.UnsubscribeURL !== undefined){let data3 = data.UnsubscribeURL;const _errs8 = errors;if(errors === _errs8){if(errors === _errs8){if(typeof data3 === "string"){if(!(formats0(data3))){validate10.errors = [{instancePath:instancePath+"/UnsubscribeURL",schemaPath:"#/properties/UnsubscribeURL/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""}];return false;}}else {validate10.errors = [{instancePath:instancePath+"/UnsubscribeURL",schemaPath:"#/properties/UnsubscribeURL/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}var valid1 = _errs8 === errors;}else {var valid1 = true;}if(valid1){if(data.SigningCertUrl !== undefined){let data4 = data.SigningCertUrl;const _errs10 = errors;if(errors === _errs10){if(errors === _errs10){if(typeof data4 === "string"){if(!(formats0(data4))){validate10.errors = [{instancePath:instancePath+"/SigningCertUrl",schemaPath:"#/properties/SigningCertUrl/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""}];return false;}}else {validate10.errors = [{instancePath:instancePath+"/SigningCertUrl",schemaPath:"#/properties/SigningCertUrl/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}var valid1 = _errs10 === errors;}else {var valid1 = true;}if(valid1){if(data.SigningCertURL !== undefined){let data5 = data.SigningCertURL;const _errs12 = errors;if(errors === _errs12){if(errors === _errs12){if(typeof data5 === "string"){if(!(formats0(data5))){validate10.errors = [{instancePath:instancePath+"/SigningCertURL",schemaPath:"#/properties/SigningCertURL/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""}];return false;}}else {validate10.errors = [{instancePath:instancePath+"/SigningCertURL",schemaPath:"#/properties/SigningCertURL/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}var valid1 = _errs12 === errors;}else {var valid1 = true;}if(valid1){if(data.Type !== undefined){const _errs14 = errors;if("Notification" !== data.Type){validate10.errors = [{instancePath:instancePath+"/Type",schemaPath:"#/properties/Type/const",keyword:"const",params:{allowedValue: "Notification"},message:"must be equal to constant"}];return false;}var valid1 = _errs14 === errors;}else {var valid1 = true;}if(valid1){if(data.MessageAttributes !== undefined){let data7 = data.MessageAttributes;const _errs15 = errors;if(errors === _errs15){if(data7 && typeof data7 == "object" && !Array.isArray(data7)){for(const key0 in data7){let data8 = data7[key0];const _errs18 = errors;const _errs19 = errors;if(errors === _errs19){if(data8 && typeof data8 == "object" && !Array.isArray(data8)){let missing1;if(((data8.Type === undefined) && (missing1 = "Type")) || ((data8.Value === undefined) && (missing1 = "Value"))){validate10.errors = [{instancePath:instancePath+"/MessageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/SnsMsgAttribute/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];return false;}else {if(data8.Type !== undefined){const _errs22 = errors;if(typeof data8.Type !== "string"){validate10.errors = [{instancePath:instancePath+"/MessageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/Type",schemaPath:"#/$defs/SnsMsgAttribute/properties/Type/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs22 === errors;}else {var valid4 = true;}if(valid4){if(data8.Value !== undefined){const _errs24 = errors;if(typeof data8.Value !== "string"){validate10.errors = [{instancePath:instancePath+"/MessageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/Value",schemaPath:"#/$defs/SnsMsgAttribute/properties/Value/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs24 === errors;}else {var valid4 = true;}}}}else {validate10.errors = [{instancePath:instancePath+"/MessageAttributes/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/SnsMsgAttribute/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid2 = _errs18 === errors;if(!valid2){break;}}}else {validate10.errors = [{instancePath:instancePath+"/MessageAttributes",schemaPath:"#/properties/MessageAttributes/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs15 === errors;}else {var valid1 = true;}if(valid1){if(data.Message !== undefined){const _errs26 = errors;if(typeof data.Message !== "string"){validate10.errors = [{instancePath:instancePath+"/Message",schemaPath:"#/properties/Message/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs26 === errors;}else {var valid1 = true;}if(valid1){if(data.MessageId !== undefined){const _errs28 = errors;if(typeof data.MessageId !== "string"){validate10.errors = [{instancePath:instancePath+"/MessageId",schemaPath:"#/properties/MessageId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs28 === errors;}else {var valid1 = true;}if(valid1){if(data.Signature !== undefined){const _errs30 = errors;if(typeof data.Signature !== "string"){validate10.errors = [{instancePath:instancePath+"/Signature",schemaPath:"#/properties/Signature/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs30 === errors;}else {var valid1 = true;}if(valid1){if(data.SignatureVersion !== undefined){const _errs32 = errors;if(typeof data.SignatureVersion !== "string"){validate10.errors = [{instancePath:instancePath+"/SignatureVersion",schemaPath:"#/properties/SignatureVersion/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs32 === errors;}else {var valid1 = true;}if(valid1){if(data.Timestamp !== undefined){let data15 = data.Timestamp;const _errs34 = errors;if(errors === _errs34){if(errors === _errs34){if(typeof data15 === "string"){if(!(formats8.validate(data15))){validate10.errors = [{instancePath:instancePath+"/Timestamp",schemaPath:"#/properties/Timestamp/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""}];return false;}}else {validate10.errors = [{instancePath:instancePath+"/Timestamp",schemaPath:"#/properties/Timestamp/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}var valid1 = _errs34 === errors;}else {var valid1 = true;}}}}}}}}}}}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;