# Event Horizon [(@skyleague/event-horizon)](https://skyleague.github.io/event-horizon/) 

<p>
  <img alt="Lines of code" src="https://img.shields.io/tokei/lines/github/skyleague/event-horizon"/>
  <img alt="Version" src="https://img.shields.io/github/package-json/v/skyleague/event-horizon"/>
  <img alt="LGTM Grade" src="https://img.shields.io/lgtm/grade/javascript/github/skyleague/event-horizon"/>
  <img src="https://img.shields.io/badge/node-%3E%3D16-blue.svg"/>
  <a href="#license">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> I propose that the information is stored not in the interior of the black hole as one might expect, but on its boundary, the event horizon
>
> -   Stephen Hawking

Event Horizon simplifies doing _the right_ thing with AWS lambda handlers. It tries to do _as little_ as possible, and adds little functionality:

-   Typing & validation on handler input and output.
-   Sane and configurable error handling depending on the event source.
-   Exposes loggers, tracing and metrics functionality.
-   A standardized way of injecting dependencies in the cold start of lambdas.
-   Out of the box [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html) integration.
-   OpenAPI documentation generation.
-   Tries to stay out of your way as much as possible.

Notably, Event Horizon is _not_ an http framework. Routing is outside of the scope of this library. Replacing the library with something else shouldn't be hard due to its limited functionality.

## [Documentation](https://skyleague.github.io/event-horizon/)

The documentation can be found [here](https://skyleague.github.io/event-horizon/).

<!-- GETTING STARTED -->

## Install

Use npm to install event-horizon and the event-horizon-cli

```sh
npm i @skyleague/event-horizon
```

## Handlers

### HTTP

An example http handler:

```
export const handler = httpHandler({
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
            logger.info('Request received', {
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

## Local Development

Install [Event Horizon CLI module](https://github.com/skyleague/event-horizon-cli)

```sh
npm i @skyleague/event-horizon-dev
```

<!-- USAGE EXAMPLES -->

## Usage

In the examples folder you will find a pet-store application which you can run.

```sh
event-horizon-dev start examples/pet-store/functions/index.ts | npx pino-pretty -m message
```

Two local endpoints will become available on http://localhost:3000

[http://localhost:3000/pet](http://localhost:3000/pet) and [http://localhost:3000/pet/findByStatus ](http://localhost:3000/pet/findByStatus?status=sold)

Logs will be available in your terminal.

## Alternative projects

In no particular order, the following libraries try to solve similar problems (albeit very differently):

-   [`Middy`](https://middy.js.org/)
-   [`Serverless Express`](https://github.com/vendia/serverless-express)
-   The list goes on...

PR's are very welcome if you think your project is missing here.

## Support

SkyLeague provides Enterprise Support on this open-source library package at clients across industries. Please get in touch via [`https://skyleague.io`](https://skyleague.io).

If you are not under Enterprise Support, feel free to raise an issue and we'll take a look at it on a best-effort basis!

## License & Copyright

This library is licensed under the MIT License (see [LICENSE.md](./LICENSE.md) for details).

If you using this SDK without Enterprise Support, please note this (partial) MIT license clause:

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND

Copyright (c) 2022, SkyLeague Technologies B.V.. 'SkyLeague' and the astronaut logo are trademarks of SkyLeague Technologies, registered at Chamber of Commerce in The Netherlands under number 86650564.

All product names, logos, brands, trademarks and registered trademarks are property of their respective owners. All company, product and service names used in this website are for identification purposes only. Use of these names, trademarks and brands does not imply endorsement.
