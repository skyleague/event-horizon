import * as handlers from '..//index.js'
import { version, name } from '../../../../package.json' assert { type: 'json' }
import type { HTTPHandler } from '../../../../src/index.js'
import { httpHandler, openapiFromHandlers } from '../../../../src/index.js'

export const handlerJson: HTTPHandler = httpHandler({
    http: {
        method: 'get',
        path: '/openapi.json',
        schema: {
            responses: {},
        },
        handler: () => {
            return {
                statusCode: 200,
                body: openapiFromHandlers(handlers, { info: { title: name, version } }),
            }
        },
    },
})

export const handlerHtml: HTTPHandler = httpHandler({
    http: {
        method: 'get',
        path: '/openapi/index.html',
        schema: {
            responses: {},
        },
        handler: () => {
            return {
                statusCode: 200,
                headers: {
                    'content-type': 'text/html',
                },
                bodyType: 'plaintext',
                body: `<!DOCTYPE html>
                <html>
                  <head>
                    <title>Redoc</title>
                    <meta charset="utf-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
                    <style>
                      body {
                        margin: 0;
                        padding: 0;
                      }
                    </style>
                  </head>
                  <body>
                    <redoc spec-url='../openapi.json'></redoc>
                    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"> </script>
                  </body>
                </html>`,
            }
        },
    },
})
