<!-- ABOUT-->
## Event Horizon (@skyleague/event-horizon) 
<p>
  <img alt="Lines of code" src="https://img.shields.io/tokei/lines/github/skyleague/event-horizon"/>
  <img alt="Version" src="https://img.shields.io/github/package-json/v/skyleague/event-horizon"/>
  <img alt="LGTM Grade" src="https://img.shields.io/lgtm/grade/javascript/github/skyleague/event-horizon"/>
  <img src="https://img.shields.io/badge/node-%3E%3D16-blue.svg"/>
  <a href="#license">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p> 

Creates a standardised boilerplate for lambda handlers specific for AWS Lambda.
It is comparable with Express middleware


<!-- GETTING STARTED -->

## Install

Use npm to install event-horizon and the event-horizon-cli

  ```sh
  npm i @skyleague/event-horizon
  ```

## Required

Install [Event Horizon CLI module](https://github.com/skyleague/event-horizon-cli)

  ```sh
  npm i @skyleague/event-horizon-cli
  ```

<!-- USAGE EXAMPLES -->

## Usage 

In the examples folder you will find a pet-store application which you can run.

  ```sh
event-horizon-cli start examples/pet-store/functions/index.ts | npx pino-pretty -m message
  ```

Two local endpoints will become available on http://localhost:3000 

[http://localhost:3000/pet](http://localhost:3000/pet) and [http://localhost:3000/pet/findByStatus
](http://localhost:3000/pet/findByStatus?status=sold)

Logs will be available in your terminal

<!-- LICENSE -->

## License

`@skyleague/event-horizon` is licensed under the MIT License (see [LICENSE.md](./LICENSE.md) for details).

