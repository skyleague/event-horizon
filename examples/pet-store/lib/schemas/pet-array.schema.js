/**
 * Generated by @skyleague/therefore
 * eslint-disable
 */
"use strict";module.exports = validate10;module.exports.default = validate10;const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","title":"PetArray","type":"array","description":"A list of Pet objects","items":{"$ref":"#/$defs/Pet"},"$defs":{"Pet":{"type":"object","description":"Pet object from the store","properties":{"id":{"type":"integer"},"category":{"$ref":"#/$defs/Category"},"name":{"type":"string"},"photoUrls":{"type":"array","items":{"type":"string"}},"tags":{"type":"array","items":{"$ref":"#/$defs/Tag"}},"status":{"enum":["available","pending","sold"]}},"required":["name","photoUrls"],"additionalProperties":false,"title":"Pet"},"Category":{"type":"object","properties":{"id":{"type":"integer"},"name":{"type":"string"}},"required":["id","name"],"additionalProperties":false,"title":"Category"},"Tag":{"type":"object","properties":{"id":{"type":"integer"},"name":{"type":"string"}},"additionalProperties":false,"title":"Tag"}}};const schema12 = {"type":"object","description":"Pet object from the store","properties":{"id":{"type":"integer"},"category":{"$ref":"#/$defs/Category"},"name":{"type":"string"},"photoUrls":{"type":"array","items":{"type":"string"}},"tags":{"type":"array","items":{"$ref":"#/$defs/Tag"}},"status":{"enum":["available","pending","sold"]}},"required":["name","photoUrls"],"additionalProperties":false,"title":"Pet"};const schema13 = {"type":"object","properties":{"id":{"type":"integer"},"name":{"type":"string"}},"required":["id","name"],"additionalProperties":false,"title":"Category"};const schema14 = {"type":"object","properties":{"id":{"type":"integer"},"name":{"type":"string"}},"additionalProperties":false,"title":"Tag"};function validate11(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if(((data.name === undefined) && (missing0 = "name")) || ((data.photoUrls === undefined) && (missing0 = "photoUrls"))){validate11.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {const _errs1 = errors;for(const key0 in data){if(!((((((key0 === "id") || (key0 === "category")) || (key0 === "name")) || (key0 === "photoUrls")) || (key0 === "tags")) || (key0 === "status"))){validate11.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];return false;break;}}if(_errs1 === errors){if(data.id !== undefined){let data0 = data.id;const _errs2 = errors;if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){validate11.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.category !== undefined){let data1 = data.category;const _errs4 = errors;const _errs5 = errors;if(errors === _errs5){if(data1 && typeof data1 == "object" && !Array.isArray(data1)){let missing1;if(((data1.id === undefined) && (missing1 = "id")) || ((data1.name === undefined) && (missing1 = "name"))){validate11.errors = [{instancePath:instancePath+"/category",schemaPath:"#/$defs/Category/required",keyword:"required",params:{missingProperty: missing1},message:"must have required property '"+missing1+"'"}];return false;}else {const _errs7 = errors;for(const key1 in data1){if(!((key1 === "id") || (key1 === "name"))){validate11.errors = [{instancePath:instancePath+"/category",schemaPath:"#/$defs/Category/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"}];return false;break;}}if(_errs7 === errors){if(data1.id !== undefined){let data2 = data1.id;const _errs8 = errors;if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){validate11.errors = [{instancePath:instancePath+"/category/id",schemaPath:"#/$defs/Category/properties/id/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];return false;}var valid2 = _errs8 === errors;}else {var valid2 = true;}if(valid2){if(data1.name !== undefined){const _errs10 = errors;if(typeof data1.name !== "string"){validate11.errors = [{instancePath:instancePath+"/category/name",schemaPath:"#/$defs/Category/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid2 = _errs10 === errors;}else {var valid2 = true;}}}}}else {validate11.errors = [{instancePath:instancePath+"/category",schemaPath:"#/$defs/Category/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid0 = _errs4 === errors;}else {var valid0 = true;}if(valid0){if(data.name !== undefined){const _errs12 = errors;if(typeof data.name !== "string"){validate11.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs12 === errors;}else {var valid0 = true;}if(valid0){if(data.photoUrls !== undefined){let data5 = data.photoUrls;const _errs14 = errors;if(errors === _errs14){if(Array.isArray(data5)){var valid3 = true;const len0 = data5.length;for(let i0=0; i0<len0; i0++){const _errs16 = errors;if(typeof data5[i0] !== "string"){validate11.errors = [{instancePath:instancePath+"/photoUrls/" + i0,schemaPath:"#/properties/photoUrls/items/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid3 = _errs16 === errors;if(!valid3){break;}}}else {validate11.errors = [{instancePath:instancePath+"/photoUrls",schemaPath:"#/properties/photoUrls/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid0 = _errs14 === errors;}else {var valid0 = true;}if(valid0){if(data.tags !== undefined){let data7 = data.tags;const _errs18 = errors;if(errors === _errs18){if(Array.isArray(data7)){var valid4 = true;const len1 = data7.length;for(let i1=0; i1<len1; i1++){let data8 = data7[i1];const _errs20 = errors;const _errs21 = errors;if(errors === _errs21){if(data8 && typeof data8 == "object" && !Array.isArray(data8)){const _errs23 = errors;for(const key2 in data8){if(!((key2 === "id") || (key2 === "name"))){validate11.errors = [{instancePath:instancePath+"/tags/" + i1,schemaPath:"#/$defs/Tag/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"}];return false;break;}}if(_errs23 === errors){if(data8.id !== undefined){let data9 = data8.id;const _errs24 = errors;if(!(((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9))) && (isFinite(data9)))){validate11.errors = [{instancePath:instancePath+"/tags/" + i1+"/id",schemaPath:"#/$defs/Tag/properties/id/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];return false;}var valid6 = _errs24 === errors;}else {var valid6 = true;}if(valid6){if(data8.name !== undefined){const _errs26 = errors;if(typeof data8.name !== "string"){validate11.errors = [{instancePath:instancePath+"/tags/" + i1+"/name",schemaPath:"#/$defs/Tag/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid6 = _errs26 === errors;}else {var valid6 = true;}}}}else {validate11.errors = [{instancePath:instancePath+"/tags/" + i1,schemaPath:"#/$defs/Tag/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid4 = _errs20 === errors;if(!valid4){break;}}}else {validate11.errors = [{instancePath:instancePath+"/tags",schemaPath:"#/properties/tags/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid0 = _errs18 === errors;}else {var valid0 = true;}if(valid0){if(data.status !== undefined){let data11 = data.status;const _errs28 = errors;if(!(((data11 === "available") || (data11 === "pending")) || (data11 === "sold"))){validate11.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema12.properties.status.enum},message:"must be equal to one of the allowed values"}];return false;}var valid0 = _errs28 === errors;}else {var valid0 = true;}}}}}}}}}else {validate11.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate11.errors = vErrors;return errors === 0;}function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){let vErrors = null;let errors = 0;if(errors === 0){if(Array.isArray(data)){var valid0 = true;const len0 = data.length;for(let i0=0; i0<len0; i0++){const _errs1 = errors;if(!(validate11(data[i0], {instancePath:instancePath+"/" + i0,parentData:data,parentDataProperty:i0,rootData}))){vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);errors = vErrors.length;}var valid0 = _errs1 === errors;if(!valid0){break;}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}validate10.errors = vErrors;return errors === 0;};validate10.schema=schema11;