---
sidebar_position: 00
title: Overview
slug: /
---

# Introduction

AWS Lambda is a popular serverless computing platform that allows developers to run code in response to events, without having to worry about the underlying infrastructure. This makes it an attractive option for a wide range of applications, from simple microservices to complex, distributed systems.

## Handlers

However, one potential challenge with using AWS Lambda is writing the Lambda handlers, which are the functions that process the input events and perform the desired actions. The input events can be inconsistent and difficult to work with, as they can come from a variety of sources and have different formats and structures. This can make it challenging to write Lambda handlers that are robust, reliable, and easy to maintain.

## Consistency

One common problem with the input events is that they can have different shapes and structures depending on the source of the event. For example, an event from an Amazon S3 bucket might have a different structure than an event from an Amazon DynamoDB stream. This can make it difficult to write Lambda handlers that can handle events from multiple sources, as you have to write specific code for each event type.

## Expert Knowledge

Event Horizon simplifies the need for expert knowledge in writing AWS Lambda handlers by providing a consistent and intuitive interface for working with the input events. Event Horizon handles the details of parsing and processing the input events, providing a unified and abstracted interface for accessing the event data. This makes it easier for developers to write Lambda handlers, as they don't have to worry about the specific details of each event type and payload format.

## Error Handling

Additionally, Event Horizon provides helpful features and functionality that can make it easier to write Lambda handlers. For example, the library provides helper functions for common tasks, such as extracting information from the event data or responding to the event source. It provides support for advanced features, such as error handling and retries, or integration with other AWS services.

Overall, Event Horizon can greatly simplify the need for expert knowledge in writing AWS Lambda handlers by providing a consistent and intuitive interface for working with the input events. By using Event Horizon, developers can focus on the business logic of their application, rather than the details of the input events.

## [AWS Powertools](https://awslabs.github.io/aws-lambda-powertools-typescript/latest/)

AWS Powertools are an important resource for developers looking to build applications on top of AWS services. They provide a wealth of tools and libraries that can help to streamline development, automate common tasks, and enable developers to quickly and easily build powerful, scalable, and reliable applications.

One of the key benefits of using AWS Powertools is that they help developers to automate common tasks and processes, such as deploying and managing applications, working with data, and integrating with other services. This can save a lot of time and effort, and also help to ensure that applications are deployed consistently and reliably.

Event Horizon uses AWS Powertools as much as possible, but will create an opinionated interface around it. This means that Event Horizon comes with a set of pre-defined conventions, standards, and best practices for using AWS to build applications. This can save developers time and effort by eliminating the need to research and determine the best way to use AWS for a given use case.

The Event Horizon library is a powerful and reliable tool that provides a wealth of benefits for developers looking to build applications on top of AWS. With its pre-defined conventions, high-level abstractions, and focus on consistency and scalability, Event Horizon is the go-to choice for developers looking to get the most out of AWS Lambda.
