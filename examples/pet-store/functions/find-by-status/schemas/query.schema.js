/**
 * Generated by @skyleague/therefore
 * eslint-disable
 */
"use strict";module.exports = validate10;module.exports.default = validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"Query","type":"object","properties":{"status":{"$ref":"#/$defs/Status"}},"required":["status"],"additionalProperties":true,"$defs":{"Status":{"enum":["available","pending","sold"],"title":"Status"}}};const schema12 = {"enum":["available","pending","sold"],"title":"Status"};function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((data.status === undefined) && (missing0 = "status")){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {if(data.status !== undefined){let data0 = data.status;if(!(((data0 === "available") || (data0 === "pending")) || (data0 === "sold"))){validate10.errors = [{instancePath:instancePath+"/status",schemaPath:"#/$defs/Status/enum",keyword:"enum",params:{allowedValues: schema12.enum},message:"must be equal to one of the allowed values"}];return false;}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate10.schema=schema11;