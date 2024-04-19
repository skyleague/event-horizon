/**
 * Generated by Ajv https://ajv.js.org/guide/managing-schemas.html#standalone-validation-code 
 * eslint-disable
 */
const schema11={"$schema":"http://json-schema.org/draft-07/schema#","title":"SNSEvent","type":"object","properties":{"Records":{"type":"array","items":{"$ref":"#/$defs/SNSEventRecord"}}},"required":["Records"],"additionalProperties":true,"$defs":{"SNSEventRecord":{"type":"object","properties":{"EventVersion":{"type":"string"},"EventSubscriptionArn":{"type":"string"},"EventSource":{"type":"string"},"Sns":{"$ref":"#/$defs/SNSMessage"}},"required":["EventVersion","EventSubscriptionArn","EventSource","Sns"],"additionalProperties":true,"title":"SNSEventRecord"},"SNSMessage":{"type":"object","properties":{"SignatureVersion":{"type":"string"},"Timestamp":{"type":"string"},"Signature":{"type":"string"},"SigningCertUrl":{"type":"string"},"MessageId":{"type":"string"},"Message":{"type":"string"},"MessageAttributes":{"$ref":"#/$defs/SNSMessageAttributes"},"Type":{"type":"string"},"UnsubscribeUrl":{"type":"string"},"TopicArn":{"type":"string"},"Subject":{"type":"string"},"Token":{"type":"string"}},"required":["SignatureVersion","Timestamp","Signature","SigningCertUrl","MessageId","Message","MessageAttributes","Type","UnsubscribeUrl","TopicArn"],"additionalProperties":true,"title":"SNSMessage"},"SNSMessageAttributes":{"type":"object","additionalProperties":{"$ref":"#/$defs/SNSMessageAttribute"},"title":"SNSMessageAttributes"},"SNSMessageAttribute":{"type":"object","properties":{"Type":{"type":"string"},"Value":{"type":"string"}},"required":["Type","Value"],"additionalProperties":true,"title":"SNSMessageAttribute"}}};const schema12={"type":"object","properties":{"EventVersion":{"type":"string"},"EventSubscriptionArn":{"type":"string"},"EventSource":{"type":"string"},"Sns":{"$ref":"#/$defs/SNSMessage"}},"required":["EventVersion","EventSubscriptionArn","EventSource","Sns"],"additionalProperties":true,"title":"SNSEventRecord"};const schema13={"type":"object","properties":{"SignatureVersion":{"type":"string"},"Timestamp":{"type":"string"},"Signature":{"type":"string"},"SigningCertUrl":{"type":"string"},"MessageId":{"type":"string"},"Message":{"type":"string"},"MessageAttributes":{"$ref":"#/$defs/SNSMessageAttributes"},"Type":{"type":"string"},"UnsubscribeUrl":{"type":"string"},"TopicArn":{"type":"string"},"Subject":{"type":"string"},"Token":{"type":"string"}},"required":["SignatureVersion","Timestamp","Signature","SigningCertUrl","MessageId","Message","MessageAttributes","Type","UnsubscribeUrl","TopicArn"],"additionalProperties":true,"title":"SNSMessage"};const schema14={"type":"object","additionalProperties":{"$ref":"#/$defs/SNSMessageAttribute"},"title":"SNSMessageAttributes"};const schema15={"type":"object","properties":{"Type":{"type":"string"},"Value":{"type":"string"}},"required":["Type","Value"],"additionalProperties":true,"title":"SNSMessageAttribute"};function validate13(data,{instancePath="",parentData,parentDataProperty,rootData=data}={}){let vErrors=null;let errors=0;if(errors===0){if(data&&typeof data=="object"&&!Array.isArray(data)){for(const key0 in data){let data0=data[key0];const _errs2=errors;const _errs3=errors;if(errors===_errs3){if(data0&&typeof data0=="object"&&!Array.isArray(data0)){let missing0;if(data0.Type===void 0&&(missing0="Type")||data0.Value===void 0&&(missing0="Value")){validate13.errors=[{instancePath:instancePath+"/"+key0.replace(/~/g,"~0").replace(/\//g,"~1"),schemaPath:"#/$defs/SNSMessageAttribute/required",keyword:"required",params:{missingProperty:missing0},message:"must have required property '"+missing0+"'"}];return false}else{if(data0.Type!==void 0){const _errs6=errors;if(typeof data0.Type!=="string"){validate13.errors=[{instancePath:instancePath+"/"+key0.replace(/~/g,"~0").replace(/\//g,"~1")+"/Type",schemaPath:"#/$defs/SNSMessageAttribute/properties/Type/type",keyword:"type",params:{type:"string"},message:"must be string"}];return false}var valid2=_errs6===errors}else{var valid2=true}if(valid2){if(data0.Value!==void 0){const _errs8=errors;if(typeof data0.Value!=="string"){validate13.errors=[{instancePath:instancePath+"/"+key0.replace(/~/g,"~0").replace(/\//g,"~1")+"/Value",schemaPath:"#/$defs/SNSMessageAttribute/properties/Value/type",keyword:"type",params:{type:"string"},message:"must be string"}];return false}var valid2=_errs8===errors}else{var valid2=true}}}}else{validate13.errors=[{instancePath:instancePath+"/"+key0.replace(/~/g,"~0").replace(/\//g,"~1"),schemaPath:"#/$defs/SNSMessageAttribute/type",keyword:"type",params:{type:"object"},message:"must be object"}];return false}}var valid0=_errs2===errors;if(!valid0){break}}}else{validate13.errors=[{instancePath,schemaPath:"#/type",keyword:"type",params:{type:"object"},message:"must be object"}];return false}}validate13.errors=vErrors;return errors===0}function validate12(data,{instancePath="",parentData,parentDataProperty,rootData=data}={}){let vErrors=null;let errors=0;if(errors===0){if(data&&typeof data=="object"&&!Array.isArray(data)){let missing0;let valid0=true;for(missing0 of schema13.required){valid0=data[missing0]!==void 0;if(!valid0){validate12.errors=[{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty:missing0},message:"must have required property '"+missing0+"'"}];return false;break}}if(valid0){if(data.SignatureVersion!==void 0){const _errs2=errors;if(typeof data.SignatureVersion!=="string"){validate12.errors=[{instancePath:instancePath+"/SignatureVersion",schemaPath:"#/properties/SignatureVersion/type",keyword:"type",params:{type:"string"},message:"must be string"}];return false}var valid1=_errs2===errors}else{var valid1=true}if(valid1){if(data.Timestamp!==void 0){const _errs4=errors;if(typeof data.Timestamp!=="string"){validate12.errors=[{instancePath:instancePath+"/Timestamp",schemaPath:"#/properties/Timestamp/type",keyword:"type",params:{type:"string"},message:"must be string"}];return false}var valid1=_errs4===errors}else{var valid1=true}if(valid1){if(data.Signature!==void 0){const _errs6=errors;if(typeof data.Signature!=="string"){validate12.errors=[{instancePath:instancePath+"/Signature",schemaPath:"#/properties/Signature/type",keyword:"type",params:{type:"string"},message:"must be string"}];return false}var valid1=_errs6===errors}else{var valid1=true}if(valid1){if(data.SigningCertUrl!==void 0){const _errs8=errors;if(typeof data.SigningCertUrl!=="string"){validate12.errors=[{instancePath:instancePath+"/SigningCertUrl",schemaPath:"#/properties/SigningCertUrl/type",keyword:"type",params:{type:"string"},message:"must be string"}];return false}var valid1=_errs8===errors}else{var valid1=true}if(valid1){if(data.MessageId!==void 0){const _errs10=errors;if(typeof data.MessageId!=="string"){validate12.errors=[{instancePath:instancePath+"/MessageId",schemaPath:"#/properties/MessageId/type",keyword:"type",params:{type:"string"},message:"must be string"}];return false}var valid1=_errs10===errors}else{var valid1=true}if(valid1){if(data.Message!==void 0){const _errs12=errors;if(typeof data.Message!=="string"){validate12.errors=[{instancePath:instancePath+"/Message",schemaPath:"#/properties/Message/type",keyword:"type",params:{type:"string"},message:"must be string"}];return false}var valid1=_errs12===errors}else{var valid1=true}if(valid1){if(data.MessageAttributes!==void 0){const _errs14=errors;if(!validate13(data.MessageAttributes,{instancePath:instancePath+"/MessageAttributes",parentData:data,parentDataProperty:"MessageAttributes",rootData})){vErrors=vErrors===null?validate13.errors:vErrors.concat(validate13.errors);errors=vErrors.length}var valid1=_errs14===errors}else{var valid1=true}if(valid1){if(data.Type!==void 0){const _errs15=errors;if(typeof data.Type!=="string"){validate12.errors=[{instancePath:instancePath+"/Type",schemaPath:"#/properties/Type/type",keyword:"type",params:{type:"string"},message:"must be string"}];return false}var valid1=_errs15===errors}else{var valid1=true}if(valid1){if(data.UnsubscribeUrl!==void 0){const _errs17=errors;if(typeof data.UnsubscribeUrl!=="string"){validate12.errors=[{instancePath:instancePath+"/UnsubscribeUrl",schemaPath:"#/properties/UnsubscribeUrl/type",keyword:"type",params:{type:"string"},message:"must be string"}];return false}var valid1=_errs17===errors}else{var valid1=true}if(valid1){if(data.TopicArn!==void 0){const _errs19=errors;if(typeof data.TopicArn!=="string"){validate12.errors=[{instancePath:instancePath+"/TopicArn",schemaPath:"#/properties/TopicArn/type",keyword:"type",params:{type:"string"},message:"must be string"}];return false}var valid1=_errs19===errors}else{var valid1=true}if(valid1){if(data.Subject!==void 0){const _errs21=errors;if(typeof data.Subject!=="string"){validate12.errors=[{instancePath:instancePath+"/Subject",schemaPath:"#/properties/Subject/type",keyword:"type",params:{type:"string"},message:"must be string"}];return false}var valid1=_errs21===errors}else{var valid1=true}if(valid1){if(data.Token!==void 0){const _errs23=errors;if(typeof data.Token!=="string"){validate12.errors=[{instancePath:instancePath+"/Token",schemaPath:"#/properties/Token/type",keyword:"type",params:{type:"string"},message:"must be string"}];return false}var valid1=_errs23===errors}else{var valid1=true}}}}}}}}}}}}}}else{validate12.errors=[{instancePath,schemaPath:"#/type",keyword:"type",params:{type:"object"},message:"must be object"}];return false}}validate12.errors=vErrors;return errors===0}function validate11(data,{instancePath="",parentData,parentDataProperty,rootData=data}={}){let vErrors=null;let errors=0;if(errors===0){if(data&&typeof data=="object"&&!Array.isArray(data)){let missing0;if(data.EventVersion===void 0&&(missing0="EventVersion")||data.EventSubscriptionArn===void 0&&(missing0="EventSubscriptionArn")||data.EventSource===void 0&&(missing0="EventSource")||data.Sns===void 0&&(missing0="Sns")){validate11.errors=[{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty:missing0},message:"must have required property '"+missing0+"'"}];return false}else{if(data.EventVersion!==void 0){const _errs2=errors;if(typeof data.EventVersion!=="string"){validate11.errors=[{instancePath:instancePath+"/EventVersion",schemaPath:"#/properties/EventVersion/type",keyword:"type",params:{type:"string"},message:"must be string"}];return false}var valid0=_errs2===errors}else{var valid0=true}if(valid0){if(data.EventSubscriptionArn!==void 0){const _errs4=errors;if(typeof data.EventSubscriptionArn!=="string"){validate11.errors=[{instancePath:instancePath+"/EventSubscriptionArn",schemaPath:"#/properties/EventSubscriptionArn/type",keyword:"type",params:{type:"string"},message:"must be string"}];return false}var valid0=_errs4===errors}else{var valid0=true}if(valid0){if(data.EventSource!==void 0){const _errs6=errors;if(typeof data.EventSource!=="string"){validate11.errors=[{instancePath:instancePath+"/EventSource",schemaPath:"#/properties/EventSource/type",keyword:"type",params:{type:"string"},message:"must be string"}];return false}var valid0=_errs6===errors}else{var valid0=true}if(valid0){if(data.Sns!==void 0){const _errs8=errors;if(!validate12(data.Sns,{instancePath:instancePath+"/Sns",parentData:data,parentDataProperty:"Sns",rootData})){vErrors=vErrors===null?validate12.errors:vErrors.concat(validate12.errors);errors=vErrors.length}var valid0=_errs8===errors}else{var valid0=true}}}}}}else{validate11.errors=[{instancePath,schemaPath:"#/type",keyword:"type",params:{type:"object"},message:"must be object"}];return false}}validate11.errors=vErrors;return errors===0}function validate10(data,{instancePath="",parentData,parentDataProperty,rootData=data}={}){let vErrors=null;let errors=0;if(errors===0){if(data&&typeof data=="object"&&!Array.isArray(data)){let missing0;if(data.Records===void 0&&(missing0="Records")){validate10.errors=[{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty:missing0},message:"must have required property '"+missing0+"'"}];return false}else{if(data.Records!==void 0){let data0=data.Records;const _errs2=errors;if(errors===_errs2){if(Array.isArray(data0)){var valid1=true;const len0=data0.length;for(let i0=0;i0<len0;i0++){const _errs4=errors;if(!validate11(data0[i0],{instancePath:instancePath+"/Records/"+i0,parentData:data0,parentDataProperty:i0,rootData})){vErrors=vErrors===null?validate11.errors:vErrors.concat(validate11.errors);errors=vErrors.length}var valid1=_errs4===errors;if(!valid1){break}}}else{validate10.errors=[{instancePath:instancePath+"/Records",schemaPath:"#/properties/Records/type",keyword:"type",params:{type:"array"},message:"must be array"}];return false}}}}}else{validate10.errors=[{instancePath,schemaPath:"#/type",keyword:"type",params:{type:"object"},message:"must be object"}];return false}}validate10.errors=vErrors;return errors===0};validate10.schema=schema11;export{validate10};
