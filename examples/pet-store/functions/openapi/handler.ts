import packageJSON from '../../../../package.json' assert { type: 'json' }
import { httpApiHandler } from '../../../../src/events/apigateway/http.js'
import { openapiFromHandlers } from '../../../../src/spec/openapi/openapi.js'

import * as handlers from '../index.js'

const { name, version } = packageJSON

export const handlerJson = httpApiHandler({
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

export const handlerHtml = httpApiHandler({
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
