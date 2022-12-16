---
sidebar_position: 40
---

# Security

## Input Validation

Input validation is an important security measure that helps to prevent malicious or incorrect data from being processed by a serverless application. By validating user input, you can ensure that the data received by your application is in the correct format and meets certain criteria, such as being within a specified range or matching a specific pattern.

One way to address this challenge is to perform input validation inside your serverless functions. This means that you can validate user input as soon as it is received, before it is processed by your application. This can help to prevent malicious or incorrect data from being passed to your application, reducing the risk of security vulnerabilities.

Another benefit of input validation inside serverless functions is that it can improve the reliability and performance of your application. By ensuring that only valid data is passed to your application, you can avoid situations where your application tries to process data that is in the incorrect format or is outside the expected range. This can help to prevent errors and exceptions, which can reduce the overall complexity of your code.

Event Horizon enforces input validation on all parts that come from outside sources. For example in the HTTP handler definition:

```ts
export const handler = httpHandler({
    http: {
        schema: {
            body: Pet,
            responses: {
                200: Pet,
            },
        },
        handler: ({ body }) => {...}
        ...
    }
})
```

Here we define the schema the schema for the `body` and the 200 response. Event Horizon by default assigns the `unknown` type if no schema is given, forcing manual validation or explicit casting. When the schemas are defined, it will use the `Schema` interface to validate the values, where invalidation results in a validation error.

## Prototype Pollution

Prototype pollution is a type of security vulnerability that can occur in JavaScript applications. It occurs when an attacker is able to inject values into an object's prototype, leading to unintended behavior or even code execution.

The prototype of an object in JavaScript is a property that defines the shared characteristics of all objects that are created from a particular constructor function. When a new object is created, it inherits the properties and methods of its prototype.

Prototype pollution occurs when an attacker is able to modify the prototype of an object in a way that introduces security vulnerabilities. For example, an attacker might add a new property to an object's prototype that contains malicious code. If the object is later used by the application, the malicious code will be executed, potentially leading to security vulnerabilities.

The issue with JSON.parse() is that it preserves the `__proto__` property as a regular object key. This is not inherently a security problem, but it can become one if the object is assigned to another variable or iterated on and its values are copied. In these cases, the `__proto__` property is leaked and becomes the prototype of the object, potentially leading to security vulnerabilities. Event Horizon uses a [safe JSON parse](https://www.npmjs.com/package/secure-json-parse) function to prevent this from happening any time we parse untrusted input.
