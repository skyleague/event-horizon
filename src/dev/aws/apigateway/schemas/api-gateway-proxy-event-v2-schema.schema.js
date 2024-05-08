/* eslint-disable */
// @ts-nocheck
/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code
 */
import {createRequire} from 'module';const require = createRequire(import.meta.url);"use strict";
/** @type {unknown} */
export const validate = validate10;export default validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"APIGatewayProxyEventV2Schema","type":"object","properties":{"version":{"type":"string"},"routeKey":{"type":"string"},"rawPath":{"type":"string"},"rawQueryString":{"type":"string"},"cookies":{"type":"array","items":{"type":"string"}},"headers":{"type":"object","additionalProperties":{"type":"string"}},"queryStringParameters":{"type":"object","additionalProperties":{"type":"string"}},"pathParameters":{"type":"object","nullable":true,"additionalProperties":{"type":"string"}},"stageVariables":{"type":"object","nullable":true,"additionalProperties":{"type":"string"}},"requestContext":{"$ref":"#/$defs/APIGatewayEventRequestContextV2"},"body":{"type":"string"},"isBase64Encoded":{"type":"boolean"}},"required":["headers","isBase64Encoded","rawPath","rawQueryString","requestContext","routeKey","version"],"additionalProperties":true,"$defs":{"APIGatewayEventRequestContextV2":{"type":"object","properties":{"accountId":{"type":"string"},"apiId":{"type":"string"},"authorizer":{"$ref":"#/$defs/RequestContextV2Authorizer"},"authentication":{"type":"object","properties":{"clientCert":{"$ref":"#/$defs/APIGatewayCert"}},"additionalProperties":true},"domainName":{"type":"string"},"domainPrefix":{"type":"string"},"http":{"$ref":"#/$defs/RequestContextV2Http"},"requestId":{"type":"string"},"routeKey":{"type":"string"},"stage":{"type":"string"},"time":{"type":"string"},"timeEpoch":{"type":"number"}},"required":["accountId","apiId","domainName","domainPrefix","http","requestId","routeKey","stage","time","timeEpoch"],"additionalProperties":true},"RequestContextV2Authorizer":{"type":"object","properties":{"jwt":{"type":"object","properties":{"claims":{"type":"object","additionalProperties":true},"scopes":{"type":"array","items":{"type":"string"}}},"required":["claims"],"additionalProperties":true},"iam":{"type":"object","properties":{"accessKey":{"type":"string"},"accountId":{"type":"string"},"callerId":{"type":"string"},"principalOrgId":{"type":"string"},"userArn":{"type":"string"},"userId":{"type":"string"},"cognitoIdentity":{"type":"object","properties":{"amr":{"type":"array","items":{"type":"string"}},"identityId":{"type":"string"},"identityPoolId":{"type":"string"}},"required":["amr","identityId","identityPoolId"],"additionalProperties":true}},"required":["cognitoIdentity"],"additionalProperties":true},"lambda":{"type":"object","additionalProperties":true}},"additionalProperties":true},"APIGatewayCert":{"type":"object","properties":{"clientCertPem":{"type":"string"},"subjectDN":{"type":"string"},"issuerDN":{"type":"string"},"serialNumber":{"type":"string"},"validity":{"type":"object","properties":{"notBefore":{"type":"string"},"notAfter":{"type":"string"}},"required":["notAfter","notBefore"],"additionalProperties":true}},"required":["clientCertPem","issuerDN","serialNumber","subjectDN","validity"],"additionalProperties":true},"RequestContextV2Http":{"type":"object","properties":{"method":{"enum":["GET","POST","PUT","PATCH","DELETE","HEAD","OPTIONS"]},"path":{"type":"string"},"protocol":{"type":"string"},"sourceIp":{"type":"string","format":"ipv6"},"userAgent":{"type":"string"}},"required":["method","path","protocol","sourceIp","userAgent"],"additionalProperties":true}}};const schema12 = {"type":"object","properties":{"accountId":{"type":"string"},"apiId":{"type":"string"},"authorizer":{"$ref":"#/$defs/RequestContextV2Authorizer"},"authentication":{"type":"object","properties":{"clientCert":{"$ref":"#/$defs/APIGatewayCert"}},"additionalProperties":true},"domainName":{"type":"string"},"domainPrefix":{"type":"string"},"http":{"$ref":"#/$defs/RequestContextV2Http"},"requestId":{"type":"string"},"routeKey":{"type":"string"},"stage":{"type":"string"},"time":{"type":"string"},"timeEpoch":{"type":"number"}},"required":["accountId","apiId","domainName","domainPrefix","http","requestId","routeKey","stage","time","timeEpoch"],"additionalProperties":true};const schema13 = {"type":"object","properties":{"jwt":{"type":"object","properties":{"claims":{"type":"object","additionalProperties":true},"scopes":{"type":"array","items":{"type":"string"}}},"required":["claims"],"additionalProperties":true},"iam":{"type":"object","properties":{"accessKey":{"type":"string"},"accountId":{"type":"string"},"callerId":{"type":"string"},"principalOrgId":{"type":"string"},"userArn":{"type":"string"},"userId":{"type":"string"},"cognitoIdentity":{"type":"object","properties":{"amr":{"type":"array","items":{"type":"string"}},"identityId":{"type":"string"},"identityPoolId":{"type":"string"}},"required":["amr","identityId","identityPoolId"],"additionalProperties":true}},"required":["cognitoIdentity"],"additionalProperties":true},"lambda":{"type":"object","additionalProperties":true}},"additionalProperties":true};const schema14 = {"type":"object","properties":{"clientCertPem":{"type":"string"},"subjectDN":{"type":"string"},"issuerDN":{"type":"string"},"serialNumber":{"type":"string"},"validity":{"type":"object","properties":{"notBefore":{"type":"string"},"notAfter":{"type":"string"}},"required":["notAfter","notBefore"],"additionalProperties":true}},"required":["clientCertPem","issuerDN","serialNumber","subjectDN","validity"],"additionalProperties":true};const schema15 = {"type":"object","properties":{"method":{"enum":["GET","POST","PUT","PATCH","DELETE","HEAD","OPTIONS"]},"path":{"type":"string"},"protocol":{"type":"string"},"sourceIp":{"type":"string","format":"ipv6"},"userAgent":{"type":"string"}},"required":["method","path","protocol","sourceIp","userAgent"],"additionalProperties":true};const func0 = require("ajv/dist/runtime/equal").default;const formats0 = /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i;function validate11(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;let valid0 = true;for( missing0 of schema12.required){valid0 = data[missing0] !== undefined;if(!valid0){validate11.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;break;}}if(valid0){if(data.accountId !== undefined){const _errs2 = errors;if(typeof data.accountId !== "string"){validate11.errors = [{instancePath:instancePath+"/accountId",schemaPath:"#/properties/accountId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs2 === errors;}else {var valid1 = true;}if(valid1){if(data.apiId !== undefined){const _errs4 = errors;if(typeof data.apiId !== "string"){validate11.errors = [{instancePath:instancePath+"/apiId",schemaPath:"#/properties/apiId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs4 === errors;}else {var valid1 = true;}if(valid1){if(data.authorizer !== undefined){let data2 = data.authorizer;const _errs6 = errors;const _errs7 = errors;if(errors === _errs7){if(data2 && typeof data2 == "object" && !Array.isArray(data2)){if(data2.jwt !== undefined){let data3 = data2.jwt;const _errs10 = errors;if(errors === _errs10){if(data3 && typeof data3 == "object" && !Array.isArray(data3)){let missing1;if((data3.claims === undefined) && (missing1 = "claims")){validate11.errors = [{instancePath:instancePath+"/authorizer/jwt",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/jwt/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];return false;}else {if(data3.claims !== undefined){let data4 = data3.claims;const _errs13 = errors;if(errors === _errs13){if(data4 && typeof data4 == "object" && !Array.isArray(data4)){}else {validate11.errors = [{instancePath:instancePath+"/authorizer/jwt/claims",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/jwt/properties/claims/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid4 = _errs13 === errors;}else {var valid4 = true;}if(valid4){if(data3.scopes !== undefined){let data5 = data3.scopes;const _errs16 = errors;if(errors === _errs16){if(Array.isArray(data5)){var valid5 = true;const len0 = data5.length;for(let i0=0; i0<len0; i0++){const _errs18 = errors;if(typeof data5[i0] !== "string"){validate11.errors = [{instancePath:instancePath+"/authorizer/jwt/scopes/" + i0,schemaPath:"#/$defs/RequestContextV2Authorizer/properties/jwt/properties/scopes/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid5 = _errs18 === errors;if(!valid5){break;}}}else {validate11.errors = [{instancePath:instancePath+"/authorizer/jwt/scopes",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/jwt/properties/scopes/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid4 = _errs16 === errors;}else {var valid4 = true;}}}}else {validate11.errors = [{instancePath:instancePath+"/authorizer/jwt",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/jwt/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid3 = _errs10 === errors;}else {var valid3 = true;}if(valid3){if(data2.iam !== undefined){let data7 = data2.iam;const _errs20 = errors;if(errors === _errs20){if(data7 && typeof data7 == "object" && !Array.isArray(data7)){let missing2;if((data7.cognitoIdentity === undefined) && (missing2 = "cognitoIdentity")){validate11.errors = [{instancePath:instancePath+"/authorizer/iam",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/iam/required",keyword:"required",params:{missingProperty: missing2},message:"must have required property '"+missing2+"'"}];return false;}else {if(data7.accessKey !== undefined){const _errs23 = errors;if(typeof data7.accessKey !== "string"){validate11.errors = [{instancePath:instancePath+"/authorizer/iam/accessKey",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/iam/properties/accessKey/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid6 = _errs23 === errors;}else {var valid6 = true;}if(valid6){if(data7.accountId !== undefined){const _errs25 = errors;if(typeof data7.accountId !== "string"){validate11.errors = [{instancePath:instancePath+"/authorizer/iam/accountId",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/iam/properties/accountId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid6 = _errs25 === errors;}else {var valid6 = true;}if(valid6){if(data7.callerId !== undefined){const _errs27 = errors;if(typeof data7.callerId !== "string"){validate11.errors = [{instancePath:instancePath+"/authorizer/iam/callerId",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/iam/properties/callerId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid6 = _errs27 === errors;}else {var valid6 = true;}if(valid6){if(data7.principalOrgId !== undefined){const _errs29 = errors;if(typeof data7.principalOrgId !== "string"){validate11.errors = [{instancePath:instancePath+"/authorizer/iam/principalOrgId",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/iam/properties/principalOrgId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid6 = _errs29 === errors;}else {var valid6 = true;}if(valid6){if(data7.userArn !== undefined){const _errs31 = errors;if(typeof data7.userArn !== "string"){validate11.errors = [{instancePath:instancePath+"/authorizer/iam/userArn",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/iam/properties/userArn/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid6 = _errs31 === errors;}else {var valid6 = true;}if(valid6){if(data7.userId !== undefined){const _errs33 = errors;if(typeof data7.userId !== "string"){validate11.errors = [{instancePath:instancePath+"/authorizer/iam/userId",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/iam/properties/userId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid6 = _errs33 === errors;}else {var valid6 = true;}if(valid6){if(data7.cognitoIdentity !== undefined){let data14 = data7.cognitoIdentity;const _errs35 = errors;if(errors === _errs35){if(data14 && typeof data14 == "object" && !Array.isArray(data14)){let missing3;if((((data14.amr === undefined) && (missing3 = "amr")) || ((data14.identityId === undefined) && (missing3 = "identityId"))) || ((data14.identityPoolId === undefined) && (missing3 = "identityPoolId"))){validate11.errors = [{instancePath:instancePath+"/authorizer/iam/cognitoIdentity",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/iam/properties/cognitoIdentity/required",keyword:"required",params:{missingProperty: missing3},message:"must have required property '"+missing3+"'"}];return false;}else {if(data14.amr !== undefined){let data15 = data14.amr;const _errs38 = errors;if(errors === _errs38){if(Array.isArray(data15)){var valid8 = true;const len1 = data15.length;for(let i1=0; i1<len1; i1++){const _errs40 = errors;if(typeof data15[i1] !== "string"){validate11.errors = [{instancePath:instancePath+"/authorizer/iam/cognitoIdentity/amr/" + i1,schemaPath:"#/$defs/RequestContextV2Authorizer/properties/iam/properties/cognitoIdentity/properties/amr/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid8 = _errs40 === errors;if(!valid8){break;}}}else {validate11.errors = [{instancePath:instancePath+"/authorizer/iam/cognitoIdentity/amr",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/iam/properties/cognitoIdentity/properties/amr/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid7 = _errs38 === errors;}else {var valid7 = true;}if(valid7){if(data14.identityId !== undefined){const _errs42 = errors;if(typeof data14.identityId !== "string"){validate11.errors = [{instancePath:instancePath+"/authorizer/iam/cognitoIdentity/identityId",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/iam/properties/cognitoIdentity/properties/identityId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid7 = _errs42 === errors;}else {var valid7 = true;}if(valid7){if(data14.identityPoolId !== undefined){const _errs44 = errors;if(typeof data14.identityPoolId !== "string"){validate11.errors = [{instancePath:instancePath+"/authorizer/iam/cognitoIdentity/identityPoolId",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/iam/properties/cognitoIdentity/properties/identityPoolId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid7 = _errs44 === errors;}else {var valid7 = true;}}}}}else {validate11.errors = [{instancePath:instancePath+"/authorizer/iam/cognitoIdentity",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/iam/properties/cognitoIdentity/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid6 = _errs35 === errors;}else {var valid6 = true;}}}}}}}}}else {validate11.errors = [{instancePath:instancePath+"/authorizer/iam",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/iam/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid3 = _errs20 === errors;}else {var valid3 = true;}if(valid3){if(data2.lambda !== undefined){let data19 = data2.lambda;const _errs46 = errors;if(errors === _errs46){if(data19 && typeof data19 == "object" && !Array.isArray(data19)){}else {validate11.errors = [{instancePath:instancePath+"/authorizer/lambda",schemaPath:"#/$defs/RequestContextV2Authorizer/properties/lambda/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid3 = _errs46 === errors;}else {var valid3 = true;}}}}else {validate11.errors = [{instancePath:instancePath+"/authorizer",schemaPath:"#/$defs/RequestContextV2Authorizer/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs6 === errors;}else {var valid1 = true;}if(valid1){if(data.authentication !== undefined){let data20 = data.authentication;const _errs49 = errors;if(errors === _errs49){if(data20 && typeof data20 == "object" && !Array.isArray(data20)){if(data20.clientCert !== undefined){let data21 = data20.clientCert;const _errs53 = errors;if(errors === _errs53){if(data21 && typeof data21 == "object" && !Array.isArray(data21)){let missing4;let valid11 = true;for( missing4 of schema14.required){valid11 = data21[missing4] !== undefined;if(!valid11){validate11.errors = [{instancePath:instancePath+"/authentication/clientCert",schemaPath:"#/$defs/APIGatewayCert/required",keyword:"required",params:{missingProperty: missing4},message:"must have required property '"+missing4+"'"}];return false;break;}}if(valid11){if(data21.clientCertPem !== undefined){const _errs56 = errors;if(typeof data21.clientCertPem !== "string"){validate11.errors = [{instancePath:instancePath+"/authentication/clientCert/clientCertPem",schemaPath:"#/$defs/APIGatewayCert/properties/clientCertPem/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid12 = _errs56 === errors;}else {var valid12 = true;}if(valid12){if(data21.subjectDN !== undefined){const _errs58 = errors;if(typeof data21.subjectDN !== "string"){validate11.errors = [{instancePath:instancePath+"/authentication/clientCert/subjectDN",schemaPath:"#/$defs/APIGatewayCert/properties/subjectDN/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid12 = _errs58 === errors;}else {var valid12 = true;}if(valid12){if(data21.issuerDN !== undefined){const _errs60 = errors;if(typeof data21.issuerDN !== "string"){validate11.errors = [{instancePath:instancePath+"/authentication/clientCert/issuerDN",schemaPath:"#/$defs/APIGatewayCert/properties/issuerDN/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid12 = _errs60 === errors;}else {var valid12 = true;}if(valid12){if(data21.serialNumber !== undefined){const _errs62 = errors;if(typeof data21.serialNumber !== "string"){validate11.errors = [{instancePath:instancePath+"/authentication/clientCert/serialNumber",schemaPath:"#/$defs/APIGatewayCert/properties/serialNumber/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid12 = _errs62 === errors;}else {var valid12 = true;}if(valid12){if(data21.validity !== undefined){let data26 = data21.validity;const _errs64 = errors;if(errors === _errs64){if(data26 && typeof data26 == "object" && !Array.isArray(data26)){let missing5;if(((data26.notAfter === undefined) && (missing5 = "notAfter")) || ((data26.notBefore === undefined) && (missing5 = "notBefore"))){validate11.errors = [{instancePath:instancePath+"/authentication/clientCert/validity",schemaPath:"#/$defs/APIGatewayCert/properties/validity/required",keyword:"required",params:{missingProperty: missing5},message:"must have required property '"+missing5+"'"}];return false;}else {if(data26.notBefore !== undefined){const _errs67 = errors;if(typeof data26.notBefore !== "string"){validate11.errors = [{instancePath:instancePath+"/authentication/clientCert/validity/notBefore",schemaPath:"#/$defs/APIGatewayCert/properties/validity/properties/notBefore/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid13 = _errs67 === errors;}else {var valid13 = true;}if(valid13){if(data26.notAfter !== undefined){const _errs69 = errors;if(typeof data26.notAfter !== "string"){validate11.errors = [{instancePath:instancePath+"/authentication/clientCert/validity/notAfter",schemaPath:"#/$defs/APIGatewayCert/properties/validity/properties/notAfter/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid13 = _errs69 === errors;}else {var valid13 = true;}}}}else {validate11.errors = [{instancePath:instancePath+"/authentication/clientCert/validity",schemaPath:"#/$defs/APIGatewayCert/properties/validity/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid12 = _errs64 === errors;}else {var valid12 = true;}}}}}}}else {validate11.errors = [{instancePath:instancePath+"/authentication/clientCert",schemaPath:"#/$defs/APIGatewayCert/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}}}else {validate11.errors = [{instancePath:instancePath+"/authentication",schemaPath:"#/properties/authentication/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs49 === errors;}else {var valid1 = true;}if(valid1){if(data.domainName !== undefined){const _errs71 = errors;if(typeof data.domainName !== "string"){validate11.errors = [{instancePath:instancePath+"/domainName",schemaPath:"#/properties/domainName/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs71 === errors;}else {var valid1 = true;}if(valid1){if(data.domainPrefix !== undefined){const _errs73 = errors;if(typeof data.domainPrefix !== "string"){validate11.errors = [{instancePath:instancePath+"/domainPrefix",schemaPath:"#/properties/domainPrefix/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs73 === errors;}else {var valid1 = true;}if(valid1){if(data.http !== undefined){let data31 = data.http;const _errs75 = errors;const _errs76 = errors;if(errors === _errs76){if(data31 && typeof data31 == "object" && !Array.isArray(data31)){let missing6;let valid15 = true;for( missing6 of schema15.required){valid15 = data31[missing6] !== undefined;if(!valid15){validate11.errors = [{instancePath:instancePath+"/http",schemaPath:"#/$defs/RequestContextV2Http/required",keyword:"required",params:{missingProperty: missing6},message:"must have required property '"+missing6+"'"}];return false;break;}}if(valid15){if(data31.method !== undefined){const _errs79 = errors;let valid17;valid17 = false;for(const v0 of schema15.properties.method.enum){if(func0(data31.method, v0)){valid17 = true;break;}}if(!valid17){validate11.errors = [{instancePath:instancePath+"/http/method",schemaPath:"#/$defs/RequestContextV2Http/properties/method/enum",keyword:"enum",params:{allowedValues: schema15.properties.method.enum},message:"must be equal to one of the allowed values"}];return false;}var valid16 = _errs79 === errors;}else {var valid16 = true;}if(valid16){if(data31.path !== undefined){const _errs80 = errors;if(typeof data31.path !== "string"){validate11.errors = [{instancePath:instancePath+"/http/path",schemaPath:"#/$defs/RequestContextV2Http/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid16 = _errs80 === errors;}else {var valid16 = true;}if(valid16){if(data31.protocol !== undefined){const _errs82 = errors;if(typeof data31.protocol !== "string"){validate11.errors = [{instancePath:instancePath+"/http/protocol",schemaPath:"#/$defs/RequestContextV2Http/properties/protocol/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid16 = _errs82 === errors;}else {var valid16 = true;}if(valid16){if(data31.sourceIp !== undefined){let data35 = data31.sourceIp;const _errs84 = errors;if(errors === _errs84){if(errors === _errs84){if(typeof data35 === "string"){if(!(formats0.test(data35))){validate11.errors = [{instancePath:instancePath+"/http/sourceIp",schemaPath:"#/$defs/RequestContextV2Http/properties/sourceIp/format",keyword:"format",params:{format: "ipv6"},message:"must match format \""+"ipv6"+"\""}];return false;}}else {validate11.errors = [{instancePath:instancePath+"/http/sourceIp",schemaPath:"#/$defs/RequestContextV2Http/properties/sourceIp/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}}var valid16 = _errs84 === errors;}else {var valid16 = true;}if(valid16){if(data31.userAgent !== undefined){const _errs86 = errors;if(typeof data31.userAgent !== "string"){validate11.errors = [{instancePath:instancePath+"/http/userAgent",schemaPath:"#/$defs/RequestContextV2Http/properties/userAgent/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid16 = _errs86 === errors;}else {var valid16 = true;}}}}}}}else {validate11.errors = [{instancePath:instancePath+"/http",schemaPath:"#/$defs/RequestContextV2Http/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs75 === errors;}else {var valid1 = true;}if(valid1){if(data.requestId !== undefined){const _errs88 = errors;if(typeof data.requestId !== "string"){validate11.errors = [{instancePath:instancePath+"/requestId",schemaPath:"#/properties/requestId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs88 === errors;}else {var valid1 = true;}if(valid1){if(data.routeKey !== undefined){const _errs90 = errors;if(typeof data.routeKey !== "string"){validate11.errors = [{instancePath:instancePath+"/routeKey",schemaPath:"#/properties/routeKey/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs90 === errors;}else {var valid1 = true;}if(valid1){if(data.stage !== undefined){const _errs92 = errors;if(typeof data.stage !== "string"){validate11.errors = [{instancePath:instancePath+"/stage",schemaPath:"#/properties/stage/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs92 === errors;}else {var valid1 = true;}if(valid1){if(data.time !== undefined){const _errs94 = errors;if(typeof data.time !== "string"){validate11.errors = [{instancePath:instancePath+"/time",schemaPath:"#/properties/time/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs94 === errors;}else {var valid1 = true;}if(valid1){if(data.timeEpoch !== undefined){let data41 = data.timeEpoch;const _errs96 = errors;if(!((typeof data41 == "number") && (isFinite(data41)))){validate11.errors = [{instancePath:instancePath+"/timeEpoch",schemaPath:"#/properties/timeEpoch/type",keyword:"type",params:{type: "number"},message:"must be number"}];return false;}var valid1 = _errs96 === errors;}else {var valid1 = true;}}}}}}}}}}}}}}else {validate11.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate11.errors = vErrors;return errors === 0;}function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;let valid0 = true;for( missing0 of schema11.required){valid0 = data[missing0] !== undefined;if(!valid0){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;break;}}if(valid0){if(data.version !== undefined){const _errs2 = errors;if(typeof data.version !== "string"){validate10.errors = [{instancePath:instancePath+"/version",schemaPath:"#/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs2 === errors;}else {var valid1 = true;}if(valid1){if(data.routeKey !== undefined){const _errs4 = errors;if(typeof data.routeKey !== "string"){validate10.errors = [{instancePath:instancePath+"/routeKey",schemaPath:"#/properties/routeKey/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs4 === errors;}else {var valid1 = true;}if(valid1){if(data.rawPath !== undefined){const _errs6 = errors;if(typeof data.rawPath !== "string"){validate10.errors = [{instancePath:instancePath+"/rawPath",schemaPath:"#/properties/rawPath/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs6 === errors;}else {var valid1 = true;}if(valid1){if(data.rawQueryString !== undefined){const _errs8 = errors;if(typeof data.rawQueryString !== "string"){validate10.errors = [{instancePath:instancePath+"/rawQueryString",schemaPath:"#/properties/rawQueryString/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs8 === errors;}else {var valid1 = true;}if(valid1){if(data.cookies !== undefined){let data4 = data.cookies;const _errs10 = errors;if(errors === _errs10){if(Array.isArray(data4)){var valid2 = true;const len0 = data4.length;for(let i0=0; i0<len0; i0++){const _errs12 = errors;if(typeof data4[i0] !== "string"){validate10.errors = [{instancePath:instancePath+"/cookies/" + i0,schemaPath:"#/properties/cookies/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid2 = _errs12 === errors;if(!valid2){break;}}}else {validate10.errors = [{instancePath:instancePath+"/cookies",schemaPath:"#/properties/cookies/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid1 = _errs10 === errors;}else {var valid1 = true;}if(valid1){if(data.headers !== undefined){let data6 = data.headers;const _errs14 = errors;if(errors === _errs14){if(data6 && typeof data6 == "object" && !Array.isArray(data6)){for(const key0 in data6){const _errs17 = errors;if(typeof data6[key0] !== "string"){validate10.errors = [{instancePath:instancePath+"/headers/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/headers/additionalProperties/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs17 === errors;if(!valid3){break;}}}else {validate10.errors = [{instancePath:instancePath+"/headers",schemaPath:"#/properties/headers/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs14 === errors;}else {var valid1 = true;}if(valid1){if(data.queryStringParameters !== undefined){let data8 = data.queryStringParameters;const _errs19 = errors;if(errors === _errs19){if(data8 && typeof data8 == "object" && !Array.isArray(data8)){for(const key1 in data8){const _errs22 = errors;if(typeof data8[key1] !== "string"){validate10.errors = [{instancePath:instancePath+"/queryStringParameters/" + key1.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/queryStringParameters/additionalProperties/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid4 = _errs22 === errors;if(!valid4){break;}}}else {validate10.errors = [{instancePath:instancePath+"/queryStringParameters",schemaPath:"#/properties/queryStringParameters/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs19 === errors;}else {var valid1 = true;}if(valid1){if(data.pathParameters !== undefined){let data10 = data.pathParameters;const _errs24 = errors;if((!(data10 && typeof data10 == "object" && !Array.isArray(data10))) && (data10 !== null)){validate10.errors = [{instancePath:instancePath+"/pathParameters",schemaPath:"#/properties/pathParameters/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}if(errors === _errs24){if(data10 && typeof data10 == "object" && !Array.isArray(data10)){for(const key2 in data10){const _errs28 = errors;if(typeof data10[key2] !== "string"){validate10.errors = [{instancePath:instancePath+"/pathParameters/" + key2.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/pathParameters/additionalProperties/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid5 = _errs28 === errors;if(!valid5){break;}}}}var valid1 = _errs24 === errors;}else {var valid1 = true;}if(valid1){if(data.stageVariables !== undefined){let data12 = data.stageVariables;const _errs30 = errors;if((!(data12 && typeof data12 == "object" && !Array.isArray(data12))) && (data12 !== null)){validate10.errors = [{instancePath:instancePath+"/stageVariables",schemaPath:"#/properties/stageVariables/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}if(errors === _errs30){if(data12 && typeof data12 == "object" && !Array.isArray(data12)){for(const key3 in data12){const _errs34 = errors;if(typeof data12[key3] !== "string"){validate10.errors = [{instancePath:instancePath+"/stageVariables/" + key3.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/stageVariables/additionalProperties/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid6 = _errs34 === errors;if(!valid6){break;}}}}var valid1 = _errs30 === errors;}else {var valid1 = true;}if(valid1){if(data.requestContext !== undefined){const _errs36 = errors;if(!(validate11(data.requestContext, {instancePath:instancePath+"/requestContext",parentData:data,parentDataProperty:"requestContext",rootData}))){vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);errors = vErrors.length;}var valid1 = _errs36 === errors;}else {var valid1 = true;}if(valid1){if(data.body !== undefined){const _errs37 = errors;if(typeof data.body !== "string"){validate10.errors = [{instancePath:instancePath+"/body",schemaPath:"#/properties/body/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid1 = _errs37 === errors;}else {var valid1 = true;}if(valid1){if(data.isBase64Encoded !== undefined){const _errs39 = errors;if(typeof data.isBase64Encoded !== "boolean"){validate10.errors = [{instancePath:instancePath+"/isBase64Encoded",schemaPath:"#/properties/isBase64Encoded/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];return false;}var valid1 = _errs39 === errors;}else {var valid1 = true;}}}}}}}}}}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate.schema=schema11;