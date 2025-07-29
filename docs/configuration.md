---
sidebar_position: 10
---

# Configuration

## Environment Variables

### `EH_IS_DEBUG`

Toggles whether Event Horizon is in DEBUG mode. When it is enabled Event Horizon will leak more implementation details as part of logging or errorhandler to the consuming party.

-   Default: `true`
-   Alias: `IS_DEBUG`

### `EH_LOG_EVENT_PAYLOAD`

Toggles whether event payloads are logged by default as part of the request start.

-   Default: `false` (`true` on DEBUG mode)
-   Alias: `LOG_EVENT_PAYLOAD`

### `EH_LOG_RESULT_PAYLOAD`

Toggles whether result payloads are logged by default as part of the request finalization.

-   Default: `false` (`true` on DEBUG mode)
-   Alias: `LOG_RESULT_PAYLOAD`

### `EH_SERVICE_NAME`

Sets the service name.

-   Default: `unknown-service`
-   Alias: `SERVICE_NAME`

### `EH_SERVICE_NAMESPACE`

Sets the service namespace.

-   Default: `unknown-service`
-   Alias: `SERVICE_NAMESPACE`

### `EH_ENVIRONMENT`

Sets the environment.

-   Default: `dev`
-   Alias: `ENVIRONMENT`

### `EH_REQUEST_ID_GENERATOR`

Specify the method used for generation when the header is not found or available.

-   Default: `uuid`
-   Alias: `REQUEST_ID_GENERATOR`

### `EH_REQUEST_ID_HEADER`

Specify header that is parsed to take as `requestId`.

-   Default: `x-amz-request-id`
-   Alias: `REQUEST_ID_HEADER`

### `EH_TRACE_ID_GENERATOR`

Specify the method used for generation when the header is not found or available.

-   Default: `uuid`
-   Alias: `TRACE_ID_GENERATOR`

### `EH_TRACE_ID_HEADER`

Specify header that is parsed to take as `traceId`.

-   Default: `x-trace-id`
-   Alias: `TRACE_ID_HEADER`

### `EH_EAGER_HANDLER_INIT`

If `true` the `config` and `services` are loaded as part of the handler creation. When `false` the loading is deferred until the lambda is invoked.

-   Default: `true`
-   Alias: `EAGER_HANDLER_INIT`
