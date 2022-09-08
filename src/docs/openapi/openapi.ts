import type { EventHandler } from '../../handlers/types'

import { entriesOf, isArray, isBoolean, omitUndefined, valuesOf } from '@skyleague/axioms'
import type { OpenapiV3 } from '@skyleague/therefore'
import type { JsonSchema } from '@skyleague/therefore/src/json'
import type {
    Info,
    Parameter,
    Reference,
    RequestBody,
    Responses,
    Schema,
} from '@skyleague/therefore/src/lib/primitives/restclient/openapi.type'

interface JsonSchemaContext {
    openapi: OpenapiV3
}

export function addComponent(ctx: JsonSchemaContext, schema: JsonSchema | Schema): string {
    const { openapi } = ctx
    const name = schema.title!
    openapi.components ??= {}
    openapi.components.schemas ??= {}
    openapi.components.schemas[name] ??= schema as Schema

    return name
}

export function normalizeSchema(ctx: JsonSchemaContext, schema: JsonSchema | Reference | Schema): JsonSchema | Reference {
    if ('$ref' in schema) {
        return { $ref: schema.$ref.replace('#/$defs/', '#/components/schemas/') }
    }

    const jsonschema = schema as unknown as JsonSchema
    const title = schema.title
    delete jsonschema.$schema

    if (jsonschema.$defs !== undefined) {
        for (const def of valuesOf(jsonschema.$defs)) {
            addComponent(ctx, def)
        }

        delete jsonschema.$defs
    }

    if (jsonschema.type === 'array') {
        if (jsonschema.items !== undefined) {
            if (isArray(jsonschema.items)) {
                jsonschema.items = jsonschema.items.map((i) => normalizeSchema(ctx, i))
            } else {
                jsonschema.items = normalizeSchema(ctx, jsonschema.items)
            }
        }
    } else if (jsonschema.type === 'object') {
        if (jsonschema.properties !== undefined) {
            for (const [key, c] of entriesOf(jsonschema.properties)) {
                jsonschema.properties[key] = normalizeSchema(ctx, c)
            }
        }
        if (jsonschema.patternProperties !== undefined) {
            for (const [key, c] of entriesOf(jsonschema.patternProperties)) {
                jsonschema.patternProperties[key] = normalizeSchema(ctx, c)
            }
        }
        if (jsonschema.additionalProperties !== undefined && !isBoolean(jsonschema.additionalProperties)) {
            jsonschema.additionalProperties = normalizeSchema(ctx, jsonschema.additionalProperties)
        }
    }

    if (title !== undefined) {
        const name = addComponent(ctx, jsonschema)

        return { $ref: `#/components/schemas/${name}` }
    }

    return jsonschema
}

export interface OpenapiOptions {
    info: Info
}

export function openapiFromHandlers<H extends EventHandler>(handlers: Record<string, H>, options: OpenapiOptions) {
    const openapi: OpenapiV3 = {
        openapi: '3.0.1',
        info: options.info,
        paths: {},
        components: {},
    }
    for (const handler of valuesOf(handlers)) {
        if ('http' in handler) {
            openapi.paths[handler.http.path] ??= {}

            let requestBody: RequestBody | undefined = undefined
            const bodySchema = handler.http.schema.body?.schema
            if (bodySchema !== undefined) {
                requestBody = {
                    content: {
                        'application/json': {
                            schema: normalizeSchema({ openapi }, bodySchema as Schema) as Reference | Schema,
                        },
                    },
                }
            }
            const responses: Responses = {}
            for (const [statusCode, response] of entriesOf(handler.http.schema.responses)) {
                responses[statusCode.toString()] = {
                    content: {
                        'application/json': normalizeSchema({ openapi }, response.schema as Schema),
                    },
                }
            }

            const parameters: Parameter[] = []
            const headers = handler.http.schema.headers?.schema as JsonSchema | undefined
            if (headers?.properties !== undefined) {
                parameters.push(
                    ...entriesOf(headers.properties).map(([name, value]) =>
                        omitUndefined({
                            name: name,
                            in: 'header',
                            required: headers.required?.includes(name),
                            description: value.description,
                            deprecated: value.deprecated,
                        })
                    )
                )
            }

            const pathParams = handler.http.schema.pathParams?.schema as JsonSchema | undefined
            if (pathParams?.properties !== undefined) {
                parameters.push(
                    ...entriesOf(pathParams.properties).map(([name, value]) =>
                        omitUndefined({
                            name: name,
                            in: 'path',
                            required: true,
                            description: value.description,
                            deprecated: value.deprecated,
                        })
                    )
                )
            }

            const query = handler.http.schema.query?.schema as JsonSchema | undefined
            if (query?.properties !== undefined) {
                parameters.push(
                    ...entriesOf(query.properties).map(([name, value]) =>
                        omitUndefined({
                            name: name,
                            in: 'query',
                            required: query.required?.includes(name),
                            description: value.description,
                            deprecated: value.deprecated,
                        })
                    )
                )
            }

            openapi.paths[handler.http.path][handler.http.method] = omitUndefined({
                operationId: handler.operationId,
                description: handler.description,
                parameters,
                requestBody,
                responses,
            })
        }
    }

    return openapi
}
