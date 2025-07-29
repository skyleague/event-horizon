---
sidebar_position: 00
title: Common
---

# Common

## Error Handling

Any unhandled errors are caught and depending on the EventError settings the lambda will log the error and either exit gracefully or throw an error. This error handling is run on top of the specific handler logic.

## Metrics

Amazon CloudWatch is a monitoring service offered by Amazon Web Services (AWS) that provides real-time visibility into your AWS resources and applications. One of the key features of CloudWatch is the ability to collect and track metrics, which are variables that measure the behavior and performance of your AWS resources and applications.

Event Horizon by default sets:

1. The function name.
2. Publish information about ColdStarts.
3. Sets default dimensions. Notably, Event Horizon will make sure all metrics are published during the lambda invocation lifecycle.

## Warmup

Lambda warmers are a way to keep your Lambda functions warm and ready to respond to incoming requests quickly. This is important because when a Lambda function is initially triggered, it can take a few seconds for the function to "warm up" and be ready to handle requests. During this warm-up period, the first request to the function may experience slower response times.

To prevent this, Lambda warmers allow you to pre-invoke your Lambda functions on a regular basis, keeping them warm and ready to respond to requests quickly. This can be especially useful for Lambda functions that are not frequently used, as they may otherwise go cold and take longer to warm up when they are needed.

Event Horizon allows defining Lambda warmers using CloudWatch schedules on every handler type, by setting the input as the string `__WARMER__`. When Event Horizon receives this input, it knows to early exit the handler.

## Tracing

AWS X-Ray is a service that allows developers to debug and analyze the performance of their applications. You can use the `tracer` to add subsegments to the segment, which represent individual pieces of your application's code that you want to instrument.

## Handler

### Config

The `config` part of the handler definition is used for very simple lambda configuration like loading environment variables. Separating your configuration from the service layer will make it easier to unit test your lambda handler code.

```ts
export const handler = rawHandler({
    config: {
        url: process.env.APPLICATION_URL,
    },
    raw: {
        schema: {},
        handler: (_, { config, logger }) => {
            logger.info('this is the config', config)
        },
    },
})
```

### Services

The services object/function gets the `config` object as input and can be used to create services that will be used inside the lambda handler. This function takes care of the dependency injection.

```ts
export const handler = rawHandler({
    config: {
        url: process.env.APPLICATION_URL,
    },
    services: (config) => ({
        getConfig: () => config,
    }),
    raw: {
        schema: {},
        handler: (_, { services, logger }) => {
            logger.info('we use the services here', services.getConfig())
        },
    },
})
```

### Profile

AWS AppConfig is a service that allows you to manage and deliver configuration data to applications. It provides a number of features and tools to help you store, manage, and distribute configuration data, and ensures that your applications always have access to the latest configuration data.

Event Horizon is able to load the configuration profiles by default as long as a few preconditions are met:

1. A profile is specified in the handler.
2. The service namespace is set.
3. The service name is set.
4. The environment is set.

```ts
export const handler = rawHandler({
    profile: { schema: Profile },
    raw: {
        schema: {},
        handler: (_, { profile, logger }) => {
            logger.info('this is the profile', profile)
        },
    },
})
```

When all of these conditions are met, Event Horizon will start a AppConfig session on the first lambda invocation, and refreshes this configuration once every 5 seconds.

### isSensitive

Toggles if the input/output of this lambda should be considered as sensitive. When sensitivity is detected, Event Horizon will try to log as little information as possible.

### operationId

The `operationId` field is used to define a unique identifier for each API operation. This identifier is used to reference the operation in other parts of the specification, such as when defining parameters or responses.

The field is typically a short, descriptive string that summarizes the purpose of the operation. For example, an operation that creates a new user account might have an `operationId` of `createUser`, while an operation that retrieves a list of user accounts might have an `operationId` of `listUsers`.

```ts
export const handler = rawHandler({
    operationId: 'handler',
    raw: {
        schema: {},
        handler: (_, { logger }) => {
            logger.info('this is a handler!')
        },
    },
})
```

### summary

This field is typically used to provide a brief overview of the operation and its purpose, and can be displayed in user interfaces to help developers understand what the operation does. The summary field should be concise and to the point, and should not contain any implementation details or other information that is not relevant to the operation's purpose.

### description

This field is typically used to provide additional information about the operation, such as its input and output parameters, any special requirements or constraints that apply to the operation, and any other relevant details. Unlike the summary field, the description field can contain more in-depth information and can be used to provide a comprehensive overview of the operation.

### tags

This field allows developers to organize their API in a logical manner, making it easier to understand and use. Each operation in the specification can be assigned one or more tags.
