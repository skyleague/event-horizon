---
sidebar_position: 10
---

# HTTP

```ts
export const handler = httpHandler({
    description: 'Add a new pet to the store',
    http: {
        method: 'post',
        path: '/pet',
        schema: {
            body: Pet,
            responses: {
                200: Pet,
            },
        },
        handler: ({ body }, { logger }) => {
            logger.info('foo', {
                foo: 'bar',
            })

            return {
                statusCode: 200,
                body: body,
            }
        },
    },
})
```

## Options

### method

This field specifies the type of action that the operation performs, such as creating a new resource, retrieving an existing resource, updating a resource, or deleting a resource.

The method field is typically a string that specifies one of the standard HTTP methods, such as `get`, `post`, `put`, `delete`, etc. For example, a `get` method indicates that the operation is used to retrieve a resource, while a `post` method indicates that the operation is used to create a new resource.

### path

This field specifies the location of the operation within the API, and is used by clients to access the operation. The path field is a string that begins with a forward slash (/) and includes placeholders for any parameters that are required by the operation.

For example, a path might look like this:

```ts
/users/{userId}
```

In this example, the path includes a placeholder for the user's ID, which is specified using curly braces ({}). When a client accesses this operation, they would need to provide a specific user ID in order to access the correct resource.

### schema

#### body

When specified the `body` will be validated against the schema, and the type will be inferred on the handler.

#### query

When specified the `query` will be validated against the schema, and the type will be inferred on the handler.

#### path

When specified the `path` will be validated against the schema, and the type will be inferred on the handler.

#### headers

When specified the `headers` will be validated against the schema, and the type will be inferred on the handler.

#### responses

A dictionary with as key the `statusCode` and as value the schema that is used for validation.

### handler

### bodyType

Specifies the parsing method used on the incoming request.

#### `json` (Default)

Parses the body and decodes it when base64 encoding is found.

#### `binary`

Leaves the body unparsed and passes the string to the handler.

#### `plaintext`

Decodes the base64 encoding when it is found.

### gatewayVersion

API Gateway V1 is the original version of the service, and is focused on providing a simple and easy-to-use API management solution. V1 supports most of the common features that are needed to create, publish, and manage APIs, including support for REST and WebSocket APIs, and the ability to create custom domain names and deploy APIs to multiple stages.

API Gateway V2, on the other hand, is a newer version of the service that was introduced to provide additional features and capabilities. V2 supports many of the same features as V1, but also includes support for additional protocols and integration types, such as HTTP APIs and Lambda integrations. V2 also offers improved performance and scalability, as well as enhanced security and monitoring capabilities.

By default Event Horizon uses `v1` and uses the associated types. Support is available for V2, by setting the `gatewayVersion` to `v2`.

## Error Handling

When an error is thrown or returned from the handler, Event Horizon automatically converts this into a valid HTTP response. If the handler was not marked as sensitive, the error first gets logged. After that the error is converted to the following schema:

```ts
interface {
    statusCode: number
    message: string
    stack?: string
}
```

-   `statusCode` is the http status the lambda returns.
-   `message` when `expose` is enabled, and the handler is not configured as sensitive we provide the error message here, otherwise we just log the error name.
-   `stack` when debugging is enabled and the error was a server error the stack trace is provided.

## Testing

```ts
import { forAll, tuple } from '@skyleague/axioms'
import { context, httpEvent } from '@skyleague/event-horizon-dev'

test('handler', async () => {
    forAll(tuple(httpEvent(handler), await context(handler)), ([x, ctx]) => {
        const { statusCode, body } = handler.http.handler(x, ctx)
        return statusCode === 200 && PetArray.is(body) && body.every((p) => p.status === x.query.status)
    })
})
```
