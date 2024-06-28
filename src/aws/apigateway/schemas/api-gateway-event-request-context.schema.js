/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
import { default as ajvDistRuntimeEqualDefault } from 'ajv/dist/runtime/equal.js';
"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"APIGatewayEventRequestContext","type":"object","properties":{"accountId":{"type":"string"},"apiId":{"type":"string"},"authorizer":{"type":"object","nullable":true,"properties":{"claims":{"type":"object","nullable":true,"additionalProperties":true},"scopes":{"type":"array","nullable":true,"items":{"type":"string"}}},"additionalProperties":true},"stage":{"type":"string"},"protocol":{"type":"string"},"identity":{"$ref":"#/$defs/APIGatewayEventIdentity"},"requestId":{"type":"string"},"requestTime":{"type":"string"},"requestTimeEpoch":{"type":"number"},"resourceId":{"type":"string","nullable":true},"resourcePath":{"type":"string"},"domainName":{"type":"string","nullable":true},"domainPrefix":{"type":"string","nullable":true},"extendedRequestId":{"type":"string","nullable":true},"httpMethod":{"enum":["GET","POST","PUT","PATCH","DELETE","HEAD","OPTIONS"]},"path":{"type":"string"},"connectedAt":{"type":"number","nullable":true},"connectionId":{"type":"string","nullable":true},"eventType":{"enum":["CONNECT","MESSAGE","DISCONNECT",null]},"messageDirection":{"type":"string","nullable":true},"messageId":{"type":"string","nullable":true},"routeKey":{"type":"string","nullable":true},"operationName":{"type":"string","nullable":true}},"required":["accountId","apiId","httpMethod","identity","path","protocol","requestId","requestTime","requestTimeEpoch","resourcePath","stage"],"additionalProperties":true,"$defs":{"APIGatewayEventIdentity":{"type":"object","properties":{"accessKey":{"type":"string","nullable":true},"accountId":{"type":"string","nullable":true},"apiKey":{"type":"string","nullable":true},"apiKeyId":{"type":"string","nullable":true},"caller":{"type":"string","nullable":true},"cognitoAuthenticationProvider":{"type":"string","nullable":true},"cognitoAuthenticationType":{"type":"string","nullable":true},"cognitoIdentityId":{"type":"string","nullable":true},"cognitoIdentityPoolId":{"type":"string","nullable":true},"principalOrgId":{"type":"string","nullable":true},"sourceIp":{"anyOf":[{"type":"string"},{"const":"test-invoke-source-ip"}]},"user":{"type":"string","nullable":true},"userAgent":{"type":"string","nullable":true},"userArn":{"type":"string","nullable":true},"clientCert":{"anyOf":[{"$ref":"#/$defs/APIGatewayCert"},{"type":"null"}]}},"additionalProperties":true},"APIGatewayCert":{"type":"object","nullable":true,"properties":{"clientCertPem":{"type":"string"},"subjectDN":{"type":"string"},"issuerDN":{"type":"string"},"serialNumber":{"type":"string"},"validity":{"type":"object","properties":{"notBefore":{"type":"string"},"notAfter":{"type":"string"}},"required":["notAfter","notBefore"],"additionalProperties":true}},"required":["clientCertPem","issuerDN","serialNumber","subjectDN","validity"],"additionalProperties":true}}};const schema12 = {"type":"object","properties":{"accessKey":{"type":"string","nullable":true},"accountId":{"type":"string","nullable":true},"apiKey":{"type":"string","nullable":true},"apiKeyId":{"type":"string","nullable":true},"caller":{"type":"string","nullable":true},"cognitoAuthenticationProvider":{"type":"string","nullable":true},"cognitoAuthenticationType":{"type":"string","nullable":true},"cognitoIdentityId":{"type":"string","nullable":true},"cognitoIdentityPoolId":{"type":"string","nullable":true},"principalOrgId":{"type":"string","nullable":true},"sourceIp":{"anyOf":[{"type":"string"},{"const":"test-invoke-source-ip"}]},"user":{"type":"string","nullable":true},"userAgent":{"type":"string","nullable":true},"userArn":{"type":"string","nullable":true},"clientCert":{"anyOf":[{"$ref":"#/$defs/APIGatewayCert"},{"type":"null"}]}},"additionalProperties":true};const schema13 = {"type":"object","nullable":true,"properties":{"clientCertPem":{"type":"string"},"subjectDN":{"type":"string"},"issuerDN":{"type":"string"},"serialNumber":{"type":"string"},"validity":{"type":"object","properties":{"notBefore":{"type":"string"},"notAfter":{"type":"string"}},"required":["notAfter","notBefore"],"additionalProperties":true}},"required":["clientCertPem","issuerDN","serialNumber","subjectDN","validity"],"additionalProperties":true};function validate11(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){if(data.accessKey !== undefined){let data0 = data.accessKey;const _errs2 = errors;if((typeof data0 !== "string") && (data0 !== null)){validate11.errors = [{instancePath:instancePath+"/accessKey",schemaPath:"#/properties/accessKey/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.accountId !== undefined){let data1 = data.accountId;const _errs5 = errors;if((typeof data1 !== "string") && (data1 !== null)){validate11.errors = [{instancePath:instancePath+"/accountId",schemaPath:"#/properties/accountId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs5 === errors;}else {var valid0 = true;}if(valid0){if(data.apiKey !== undefined){let data2 = data.apiKey;const _errs8 = errors;if((typeof data2 !== "string") && (data2 !== null)){validate11.errors = [{instancePath:instancePath+"/apiKey",schemaPath:"#/properties/apiKey/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs8 === errors;}else {var valid0 = true;}if(valid0){if(data.apiKeyId !== undefined){let data3 = data.apiKeyId;const _errs11 = errors;if((typeof data3 !== "string") && (data3 !== null)){validate11.errors = [{instancePath:instancePath+"/apiKeyId",schemaPath:"#/properties/apiKeyId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs11 === errors;}else {var valid0 = true;}if(valid0){if(data.caller !== undefined){let data4 = data.caller;const _errs14 = errors;if((typeof data4 !== "string") && (data4 !== null)){validate11.errors = [{instancePath:instancePath+"/caller",schemaPath:"#/properties/caller/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs14 === errors;}else {var valid0 = true;}if(valid0){if(data.cognitoAuthenticationProvider !== undefined){let data5 = data.cognitoAuthenticationProvider;const _errs17 = errors;if((typeof data5 !== "string") && (data5 !== null)){validate11.errors = [{instancePath:instancePath+"/cognitoAuthenticationProvider",schemaPath:"#/properties/cognitoAuthenticationProvider/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs17 === errors;}else {var valid0 = true;}if(valid0){if(data.cognitoAuthenticationType !== undefined){let data6 = data.cognitoAuthenticationType;const _errs20 = errors;if((typeof data6 !== "string") && (data6 !== null)){validate11.errors = [{instancePath:instancePath+"/cognitoAuthenticationType",schemaPath:"#/properties/cognitoAuthenticationType/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs20 === errors;}else {var valid0 = true;}if(valid0){if(data.cognitoIdentityId !== undefined){let data7 = data.cognitoIdentityId;const _errs23 = errors;if((typeof data7 !== "string") && (data7 !== null)){validate11.errors = [{instancePath:instancePath+"/cognitoIdentityId",schemaPath:"#/properties/cognitoIdentityId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs23 === errors;}else {var valid0 = true;}if(valid0){if(data.cognitoIdentityPoolId !== undefined){let data8 = data.cognitoIdentityPoolId;const _errs26 = errors;if((typeof data8 !== "string") && (data8 !== null)){validate11.errors = [{instancePath:instancePath+"/cognitoIdentityPoolId",schemaPath:"#/properties/cognitoIdentityPoolId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs26 === errors;}else {var valid0 = true;}if(valid0){if(data.principalOrgId !== undefined){let data9 = data.principalOrgId;const _errs29 = errors;if((typeof data9 !== "string") && (data9 !== null)){validate11.errors = [{instancePath:instancePath+"/principalOrgId",schemaPath:"#/properties/principalOrgId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs29 === errors;}else {var valid0 = true;}if(valid0){if(data.sourceIp !== undefined){let data10 = data.sourceIp;const _errs32 = errors;const _errs33 = errors;let valid1 = false;const _errs34 = errors;if(typeof data10 !== "string"){const err0 = {instancePath:instancePath+"/sourceIp",schemaPath:"#/properties/sourceIp/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err0];}else {vErrors.push(err0);}errors++;}var _valid0 = _errs34 === errors;valid1 = valid1 || _valid0;if(!valid1){const _errs36 = errors;if("test-invoke-source-ip" !== data10){const err1 = {instancePath:instancePath+"/sourceIp",schemaPath:"#/properties/sourceIp/anyOf/1/const",keyword:"const",params:{allowedValue: "test-invoke-source-ip"},message:"must be equal to constant"};if(vErrors === null){vErrors = [err1];}else {vErrors.push(err1);}errors++;}var _valid0 = _errs36 === errors;valid1 = valid1 || _valid0;}if(!valid1){const err2 = {instancePath:instancePath+"/sourceIp",schemaPath:"#/properties/sourceIp/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};if(vErrors === null){vErrors = [err2];}else {vErrors.push(err2);}errors++;validate11.errors = vErrors;return false;}else {errors = _errs33;if(vErrors !== null){if(_errs33){vErrors.length = _errs33;}else {vErrors = null;}}}var valid0 = _errs32 === errors;}else {var valid0 = true;}if(valid0){if(data.user !== undefined){let data11 = data.user;const _errs37 = errors;if((typeof data11 !== "string") && (data11 !== null)){validate11.errors = [{instancePath:instancePath+"/user",schemaPath:"#/properties/user/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs37 === errors;}else {var valid0 = true;}if(valid0){if(data.userAgent !== undefined){let data12 = data.userAgent;const _errs40 = errors;if((typeof data12 !== "string") && (data12 !== null)){validate11.errors = [{instancePath:instancePath+"/userAgent",schemaPath:"#/properties/userAgent/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs40 === errors;}else {var valid0 = true;}if(valid0){if(data.userArn !== undefined){let data13 = data.userArn;const _errs43 = errors;if((typeof data13 !== "string") && (data13 !== null)){validate11.errors = [{instancePath:instancePath+"/userArn",schemaPath:"#/properties/userArn/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs43 === errors;}else {var valid0 = true;}if(valid0){if(data.clientCert !== undefined){let data14 = data.clientCert;const _errs46 = errors;const _errs47 = errors;let valid2 = false;const _errs48 = errors;const _errs49 = errors;if((!(data14 && typeof data14 == "object" && !Array.isArray(data14))) && (data14 !== null)){const err3 = {instancePath:instancePath+"/clientCert",schemaPath:"#/$defs/APIGatewayCert/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err3];}else {vErrors.push(err3);}errors++;}if(errors === _errs49){if(data14 && typeof data14 == "object" && !Array.isArray(data14)){let missing0;let valid4 = true;for( missing0 of schema13.required){valid4 = data14[missing0] !== undefined;if(!valid4){const err4 = {instancePath:instancePath+"/clientCert",schemaPath:"#/$defs/APIGatewayCert/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"};if(vErrors === null){vErrors = [err4];}else {vErrors.push(err4);}errors++;break;}}if(valid4){if(data14.clientCertPem !== undefined){const _errs53 = errors;if(typeof data14.clientCertPem !== "string"){const err5 = {instancePath:instancePath+"/clientCert/clientCertPem",schemaPath:"#/$defs/APIGatewayCert/properties/clientCertPem/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err5];}else {vErrors.push(err5);}errors++;}var valid5 = _errs53 === errors;}else {var valid5 = true;}if(valid5){if(data14.subjectDN !== undefined){const _errs55 = errors;if(typeof data14.subjectDN !== "string"){const err6 = {instancePath:instancePath+"/clientCert/subjectDN",schemaPath:"#/$defs/APIGatewayCert/properties/subjectDN/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err6];}else {vErrors.push(err6);}errors++;}var valid5 = _errs55 === errors;}else {var valid5 = true;}if(valid5){if(data14.issuerDN !== undefined){const _errs57 = errors;if(typeof data14.issuerDN !== "string"){const err7 = {instancePath:instancePath+"/clientCert/issuerDN",schemaPath:"#/$defs/APIGatewayCert/properties/issuerDN/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err7];}else {vErrors.push(err7);}errors++;}var valid5 = _errs57 === errors;}else {var valid5 = true;}if(valid5){if(data14.serialNumber !== undefined){const _errs59 = errors;if(typeof data14.serialNumber !== "string"){const err8 = {instancePath:instancePath+"/clientCert/serialNumber",schemaPath:"#/$defs/APIGatewayCert/properties/serialNumber/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err8];}else {vErrors.push(err8);}errors++;}var valid5 = _errs59 === errors;}else {var valid5 = true;}if(valid5){if(data14.validity !== undefined){let data19 = data14.validity;const _errs61 = errors;if(errors === _errs61){if(data19 && typeof data19 == "object" && !Array.isArray(data19)){let missing1;if(((data19.notAfter === undefined) && (missing1 = "notAfter")) || ((data19.notBefore === undefined) && (missing1 = "notBefore"))){const err9 = {instancePath:instancePath+"/clientCert/validity",schemaPath:"#/$defs/APIGatewayCert/properties/validity/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"};if(vErrors === null){vErrors = [err9];}else {vErrors.push(err9);}errors++;}else {if(data19.notBefore !== undefined){const _errs64 = errors;if(typeof data19.notBefore !== "string"){const err10 = {instancePath:instancePath+"/clientCert/validity/notBefore",schemaPath:"#/$defs/APIGatewayCert/properties/validity/properties/notBefore/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err10];}else {vErrors.push(err10);}errors++;}var valid6 = _errs64 === errors;}else {var valid6 = true;}if(valid6){if(data19.notAfter !== undefined){const _errs66 = errors;if(typeof data19.notAfter !== "string"){const err11 = {instancePath:instancePath+"/clientCert/validity/notAfter",schemaPath:"#/$defs/APIGatewayCert/properties/validity/properties/notAfter/type",keyword:"type",params:{type: "string"},message:"must be string"};if(vErrors === null){vErrors = [err11];}else {vErrors.push(err11);}errors++;}var valid6 = _errs66 === errors;}else {var valid6 = true;}}}}else {const err12 = {instancePath:instancePath+"/clientCert/validity",schemaPath:"#/$defs/APIGatewayCert/properties/validity/type",keyword:"type",params:{type: "object"},message:"must be object"};if(vErrors === null){vErrors = [err12];}else {vErrors.push(err12);}errors++;}}var valid5 = _errs61 === errors;}else {var valid5 = true;}}}}}}}}var _valid1 = _errs48 === errors;valid2 = valid2 || _valid1;if(!valid2){const _errs68 = errors;if(data14 !== null){const err13 = {instancePath:instancePath+"/clientCert",schemaPath:"#/properties/clientCert/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};if(vErrors === null){vErrors = [err13];}else {vErrors.push(err13);}errors++;}var _valid1 = _errs68 === errors;valid2 = valid2 || _valid1;}if(!valid2){const err14 = {instancePath:instancePath+"/clientCert",schemaPath:"#/properties/clientCert/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};if(vErrors === null){vErrors = [err14];}else {vErrors.push(err14);}errors++;validate11.errors = vErrors;return false;}else {errors = _errs47;if(vErrors !== null){if(_errs47){vErrors.length = _errs47;}else {vErrors = null;}}}var valid0 = _errs46 === errors;}else {var valid0 = true;}}}}}}}}}}}}}}}}else {validate11.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate11.errors = vErrors;return errors === 0;}const func0 = (ajvDistRuntimeEqualDefault.default ?? ajvDistRuntimeEqualDefault);function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;let valid0 = true;for( missing0 of schema11.required){valid0 = data[missing0] !== undefined;if(!valid0){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;break;}}if(valid0){if(data.accountId !== undefined){const _errs2 = errors;if(typeof data.accountId !== "string"){validate10.errors = [{instancePath:instancePath+"/accountId",schemaPath:"#/properties/accountId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs2 === errors;}else {var valid1 = true;}if(valid1){if(data.apiId !== undefined){const _errs4 = errors;if(typeof data.apiId !== "string"){validate10.errors = [{instancePath:instancePath+"/apiId",schemaPath:"#/properties/apiId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs4 === errors;}else {var valid1 = true;}if(valid1){if(data.authorizer !== undefined){let data2 = data.authorizer;const _errs6 = errors;if((!(data2 && typeof data2 == "object" && !Array.isArray(data2))) && (data2 !== null)){validate10.errors = [{instancePath:instancePath+"/authorizer",schemaPath:"#/properties/authorizer/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}if(errors === _errs6){if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.claims !== undefined){let data3 = data2.claims;const _errs10 = errors;if((!(data3 && typeof data3 == "object" && !Array.isArray(data3))) && (data3 !== null)){validate10.errors = [{instancePath:instancePath+"/authorizer/claims",schemaPath:"#/properties/authorizer/properties/claims/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}var valid2 = _errs10 === errors;}else {var valid2 = true;}if(valid2){if(data2.scopes !== undefined){let data4 = data2.scopes;const _errs14 = errors;if((!(Array.isArray(data4))) && (data4 !== null)){validate10.errors = [{instancePath:instancePath+"/authorizer/scopes",schemaPath:"#/properties/authorizer/properties/scopes/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}if(errors === _errs14){if(Array.isArray(data4)){var valid3 = true;const len0 = data4.length;for(let i0=0; i0<len0; i0++){const _errs17 = errors;if(typeof data4[i0] !== "string"){validate10.errors = [{instancePath:instancePath+"/authorizer/scopes/" + i0,schemaPath:"#/properties/authorizer/properties/scopes/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs17 === errors;if(!valid3){break;}}}}var valid2 = _errs14 === errors;}else {var valid2 = true;}}}}var valid1 = _errs6 === errors;}else {var valid1 = true;}if(valid1){if(data.stage !== undefined){const _errs19 = errors;if(typeof data.stage !== "string"){validate10.errors = [{instancePath:instancePath+"/stage",schemaPath:"#/properties/stage/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs19 === errors;}else {var valid1 = true;}if(valid1){if(data.protocol !== undefined){const _errs21 = errors;if(typeof data.protocol !== "string"){validate10.errors = [{instancePath:instancePath+"/protocol",schemaPath:"#/properties/protocol/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs21 === errors;}else {var valid1 = true;}if(valid1){if(data.identity !== undefined){const _errs23 = errors;if(!(validate11(data.identity, {instancePath:instancePath+"/identity",parentData:data,parentDataProperty:"identity",rootData}))){vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);errors = vErrors.length;}var valid1 = _errs23 === errors;}else {var valid1 = true;}if(valid1){if(data.requestId !== undefined){const _errs24 = errors;if(typeof data.requestId !== "string"){validate10.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs24 === errors;}else {var valid1 = true;}if(valid1){if(data.requestTime !== undefined){const _errs26 = errors;if(typeof data.requestTime !== "string"){validate10.errors = [{instancePath:instancePath+"/requestTime",schemaPath:"#/properties/requestTime/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs26 === errors;}else {var valid1 = true;}if(valid1){if(data.requestTimeEpoch !== undefined){let data11 = data.requestTimeEpoch;const _errs28 = errors;if(!((typeof data11 == "number") && (isFinite(data11)))){validate10.errors = [{instancePath:instancePath+"/requestTimeEpoch",schemaPath:"#/properties/requestTimeEpoch/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid1 = _errs28 === errors;}else {var valid1 = true;}if(valid1){if(data.resourceId !== undefined){let data12 = data.resourceId;const _errs30 = errors;if((typeof data12 !== "string") && (data12 !== null)){validate10.errors = [{instancePath:instancePath+"/resourceId",schemaPath:"#/properties/resourceId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs30 === errors;}else {var valid1 = true;}if(valid1){if(data.resourcePath !== undefined){const _errs33 = errors;if(typeof data.resourcePath !== "string"){validate10.errors = [{instancePath:instancePath+"/resourcePath",schemaPath:"#/properties/resourcePath/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs33 === errors;}else {var valid1 = true;}if(valid1){if(data.domainName !== undefined){let data14 = data.domainName;const _errs35 = errors;if((typeof data14 !== "string") && (data14 !== null)){validate10.errors = [{instancePath:instancePath+"/domainName",schemaPath:"#/properties/domainName/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs35 === errors;}else {var valid1 = true;}if(valid1){if(data.domainPrefix !== undefined){let data15 = data.domainPrefix;const _errs38 = errors;if((typeof data15 !== "string") && (data15 !== null)){validate10.errors = [{instancePath:instancePath+"/domainPrefix",schemaPath:"#/properties/domainPrefix/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs38 === errors;}else {var valid1 = true;}if(valid1){if(data.extendedRequestId !== undefined){let data16 = data.extendedRequestId;const _errs41 = errors;if((typeof data16 !== "string") && (data16 !== null)){validate10.errors = [{instancePath:instancePath+"/extendedRequestId",schemaPath:"#/properties/extendedRequestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs41 === errors;}else {var valid1 = true;}if(valid1){if(data.httpMethod !== undefined){const _errs44 = errors;let valid4;valid4 = false;for(const v0 of schema11.properties.httpMethod.enum){if(func0(data.httpMethod, v0)){valid4 = true;break;}}if(!valid4){validate10.errors = [{instancePath:instancePath+"/httpMethod",schemaPath:"#/properties/httpMethod/enum",keyword:"enum",params:{allowedValues: schema11.properties.httpMethod.enum},message:"must be equal to one of the allowed values"}];return false;}var valid1 = _errs44 === errors;}else {var valid1 = true;}if(valid1){if(data.path !== undefined){const _errs45 = errors;if(typeof data.path !== "string"){validate10.errors = [{instancePath:instancePath+"/path",schemaPath:"#/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs45 === errors;}else {var valid1 = true;}if(valid1){if(data.connectedAt !== undefined){let data19 = data.connectedAt;const _errs47 = errors;if((!((typeof data19 == "number") && (isFinite(data19)))) && (data19 !== null)){validate10.errors = [{instancePath:instancePath+"/connectedAt",schemaPath:"#/properties/connectedAt/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid1 = _errs47 === errors;}else {var valid1 = true;}if(valid1){if(data.connectionId !== undefined){let data20 = data.connectionId;const _errs50 = errors;if((typeof data20 !== "string") && (data20 !== null)){validate10.errors = [{instancePath:instancePath+"/connectionId",schemaPath:"#/properties/connectionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs50 === errors;}else {var valid1 = true;}if(valid1){if(data.eventType !== undefined){let data21 = data.eventType;const _errs53 = errors;if(!((((data21 === "CONNECT") || (data21 === "MESSAGE")) || (data21 === "DISCONNECT")) || (data21 === null))){validate10.errors = [{instancePath:instancePath+"/eventType",schemaPath:"#/properties/eventType/enum",keyword:"enum",params:{allowedValues: schema11.properties.eventType.enum},message:"must be equal to one of the allowed values"}];return false;}var valid1 = _errs53 === errors;}else {var valid1 = true;}if(valid1){if(data.messageDirection !== undefined){let data22 = data.messageDirection;const _errs54 = errors;if((typeof data22 !== "string") && (data22 !== null)){validate10.errors = [{instancePath:instancePath+"/messageDirection",schemaPath:"#/properties/messageDirection/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs54 === errors;}else {var valid1 = true;}if(valid1){if(data.messageId !== undefined){let data23 = data.messageId;const _errs57 = errors;if((typeof data23 !== "string") && (data23 !== null)){validate10.errors = [{instancePath:instancePath+"/messageId",schemaPath:"#/properties/messageId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs57 === errors;}else {var valid1 = true;}if(valid1){if(data.routeKey !== undefined){let data24 = data.routeKey;const _errs60 = errors;if((typeof data24 !== "string") && (data24 !== null)){validate10.errors = [{instancePath:instancePath+"/routeKey",schemaPath:"#/properties/routeKey/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs60 === errors;}else {var valid1 = true;}if(valid1){if(data.operationName !== undefined){let data25 = data.operationName;const _errs63 = errors;if((typeof data25 !== "string") && (data25 !== null)){validate10.errors = [{instancePath:instancePath+"/operationName",schemaPath:"#/properties/operationName/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs63 === errors;}else {var valid1 = true;}}}}}}}}}}}}}}}}}}}}}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;