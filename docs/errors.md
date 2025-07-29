---
sidebar_position: 20
---

# Event Errors

Event Horizon provides a utility to communicate errors with AWS Services. For some requests like HTTP these wil be neatly converted into something that can be parsed by the client - for others this impacts on how requests are processed. For specific details you can reference the handler documentation.

## Options

#### `level ('error' | 'info' | 'warning')`

The level on which this error should be logged.

#### `errorHandling ('graceful' | 'throw')`

Defines if errors should exit the Lambda gracefully, or throw an error to impact AWS Service behaviour.

#### `expose (boolean)`

Toggles if details about the error allowed to be communicated externally. By default we only allow this for Client Errors.

#### `headers (HTTPHeaders)`

Define `headers` that are added to the response.

#### `statusCode (number)`

Sets the HTTP status code. By default it will take the correct status code from the legible method.

#### `attributes (Record<string, unknown>)`

Sets attributes that are attached to the error object.

#### `cause (uknown)`

The cause of the error, this allows linking.

#### `ctor (Function)`

The `ctor` allows filtering in the attached stack trace.

#### `name (name)`

The name of the error, will take the `ctor` name by default.

## Client Errors

### EventError.validation (statusCode: 400)

```ts
EventError.validation({
    errors: Pet.errors,
    location: 'body',
})
```

### EventError.badRequest (statusCode: 400)

```ts
EventError.badRequest('invalid request')
```

### EventError.unauthorized (statusCode: 401)

```ts
EventError.unauthorized('invalid password')
```

### EventError.paymentRequired (statusCode: 402)

```ts
EventError.paymentRequired('request quota reached')
```

### EventError.forbidden (statusCode: 403)

```ts
EventError.forbidden('not allowed to see this')
```

### EventError.notFound (statusCode: 404)

```ts
EventError.notFound('the resource was not found')
```

### EventError.methodNotAllowed (statusCode: 405)

```ts
EventError.methodNotAllowed({ message: 'this method is not allowed', allow: 'get' })
```

### EventError.notAcceptable (statusCode: 406)

```ts
EventError.notAcceptable('unacceptable')
```

### EventError.proxyAuthRequired (statusCode: 407)

```ts
EventError.proxyAuthRequired('authentication not found')
```

### EventError.requestTimeout (statusCode: 408)

```ts
EventError.requestTimeout('request timed out')
```

### EventError.conflict (statusCode: 409)

```ts
EventError.conflict('there was a conflict in the resource')
```

### EventError.gone (statusCode: 410)

```ts
EventError.gone('requested resource is gone')
```

### EventError.lengthRequired (statusCode: 411)

```ts
EventError.lengthRequired('length was required')
```

### EventError.preconditionFailed (statusCode: 412)

```ts
EventError.preconditionFailed('preconditions for this request where not met')
```

### EventError.payloadTooLarge (statusCode: 413)

```ts
EventError.payloadTooLarge('request is too large')
```

### EventError.uriTooLong (statusCode: 414)

```ts
EventError.uriTooLong('uri is too long')
```

### EventError.unsupportedMediaType (statusCode: 415)

```ts
EventError.unsupportedMediaType('the media type is not supported')
```

### EventError.rangeNotSatisfiable (statusCode: 416)

```ts
EventError.rangeNotSatisfiable('requested range does not exist')
```

### EventError.expectationFailed (statusCode: 417)

```ts
EventError.expectationFailed('expectations failed')
```

### EventError.teapot (statusCode: 418)

```ts
EventError.teapot('pffffft')
```

### EventError.unprocessableEntity (statusCode: 422)

```ts
EventError.unprocessableEntity('could not process your request')
```

### EventError.locked (statusCode: 423)

```ts
EventError.locked('the resource was locked')
```

### EventError.failedDependency (statusCode: 424)

```ts
EventError.failedDependency('an external resource failed')
```

### EventError.tooEarly (statusCode: 425)

```ts
EventError.tooEarly('unwilling to process the request')
```

### EventError.preconditionRequired (statusCode: 428)

```ts
EventError.preconditionRequired('you did not supply all information')
```

### EventError.tooManyRequests (statusCode: 429)

```ts
EventError.tooManyRequests('you exceeded your limit')
```

### EventError.noResponse (statusCode: 444)

```ts
EventError.noResponse('no response')
```

### EventError.unavailableForLegalReasons (statusCode: 451)

```ts
EventError.unavailableForLegalReasons('you are not allowed to see this')
```

### EventError.retryable (statusCode: 449)

```ts
EventError.retryable('retry this request')
```

## Server Errors

### EventError.internal (statusCode: 500)

```ts
EventError.internal('internal server error found')
```

### EventError.internalServerError (statusCode: 500)

```ts
EventError.internalServerError('our implementation was bad')
```

### EventError.notImplemented (statusCode: 501)

```ts
EventError.notImplemented('we did not finish this implementation')
```

### EventError.badGateway (statusCode: 502)

```ts
EventError.badGateway('the gateway is bad')
```

### EventError.serviceUnavailable (statusCode: 503)

```ts
EventError.serviceUnavailable('unavailable')
```

### EventError.gatewayTimeout (statusCode: 504)

```ts
EventError.gatewayTimeout('the apigatway timed out')
```

### EventError.loopDetected (statusCode: 508)

```ts
EventError.loopDetected('detected a loop')
```

## Helpers

### EventError.isInformational

```ts
EventError.internal().isInformational()
```

### EventError.isSuccess

```ts
EventError.internal().isSuccess()
```

### EventError.isRedirection

```ts
EventError.internal().isRedirection()
```

### EventError.isClientError

```ts
EventError.internal().isClientError()
```

### EventError.isServerError

```ts
EventError.internal().isServerError()
```

### EventError.is

```ts
EventError.is(error)
```

### EventError.from

```ts
EventError.from(new Error('foobar'))
```
