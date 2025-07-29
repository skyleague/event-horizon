---
sidebar_position: 20
---

# SQS

```ts
export const handler = sqsHandler({
    sqs: {
        schema: {
            payload: Pet,
        },
        handler: ({ payload }, { logger }) => {
            logger.info('foo', {
                payload,
            })
        },
    },
})
```

## Options

### schema

#### payload

When specified the `body` will be validated against the schema, and the type will be inferred on the handler.

### handler

### payloadType

Specifies the parsing method used on the incoming request.

#### `json` (Default)

Parses the body and decodes it when base64 encoding is found.

#### `plaintext`

Decodes the base64 encoding when it is found.
