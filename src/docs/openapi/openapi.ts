import type { EventHandler } from '../../events/common/types.js'
import { HttpError } from '../../events/http/functions/http-error.type.js'

import { cloneDeep, entriesOf, isArray, isBoolean, omitUndefined, valuesOf } from '@skyleague/axioms'
import type { OpenapiV3 } from '@skyleague/therefore'
import type { JsonSchema } from '@skyleague/therefore/src/json.js'
import type {
    Info,
    Parameter,
    Reference,
    RequestBody,
    Responses,
    Schema,
} from '@skyleague/therefore/src/lib/primitives/restclient/openapi.type.js'

interface JsonSchemaContext {
    openapi: OpenapiV3
}

export function jsonptrToName(ptr: string) {
    return ptr.replace(/#((.*?)\/)*/, '')
}

export function addComponent(ctx: JsonSchemaContext, schema: JsonSchema | Schema, name?: string): string {
    const { openapi } = ctx
    name = schema.title ?? name!
    openapi.components ??= {}
    openapi.components.schemas ??= {}
    openapi.components.schemas[name] ??= schema as Schema

    return name
}

export function ensureTarget(
    ctx: JsonSchemaContext,
    ptr: string,
    target: 'parameters' | 'requestBodies' | 'responses' | 'schemas'
) {
    ctx.openapi.components ??= {}
    ctx.openapi.components[target] ??= {}
    const targetSchemas = ctx.openapi.components[target]
    if (targetSchemas !== undefined && target !== 'schemas') {
        const name = jsonptrToName(ptr)
        if (['requestBodies', 'responses'].includes(target)) {
            targetSchemas[name] = {
                description: (ctx.openapi.components.schemas?.[name] as Schema | undefined)?.description ?? '',
                content: {
                    'application/json': {
                        schema: {
                            $ref: `#/components/schemas/${name}`,
                        },
                    },
                },
            }
        } else {
            targetSchemas[name] = {
                $ref: `#/components/schemas/${name}`,
            }
        }
    }
}

export function normalizeSchema({
    ctx,
    schema,
    target = 'schemas',
    defsOnly = false,
}: {
    ctx: JsonSchemaContext
    schema: JsonSchema | Reference | Schema
    target?: 'parameters' | 'requestBodies' | 'responses' | 'schemas'
    defsOnly?: boolean
}): JsonSchema | Reference {
    const jsonschema = cloneDeep(schema) as unknown as JsonSchema
    delete jsonschema.$schema

    if (jsonschema.$defs !== undefined) {
        for (const [name, def] of entriesOf(jsonschema.$defs)) {
            if (def !== undefined) {
                addComponent(ctx, normalizeSchema({ ctx, schema: def }), name)
            }
        }

        delete jsonschema.$defs
    }

    if ('$ref' in jsonschema) {
        ensureTarget(ctx, jsonschema.$ref, target)
        return { ...jsonschema, $ref: jsonschema.$ref.replace('#/$defs/', `#/components/${target}/`) }
    }

    if (defsOnly) {
        return {}
    }
    if (jsonschema.anyOf !== undefined) {
        jsonschema.anyOf = jsonschema.anyOf.map((i) => normalizeSchema({ ctx, schema: i }))
    }
    if (jsonschema.oneOf !== undefined) {
        jsonschema.oneOf = jsonschema.oneOf.map((i) => normalizeSchema({ ctx, schema: i }))
    }

    if (jsonschema.type === 'array') {
        if (jsonschema.items !== undefined) {
            if (isArray(jsonschema.items)) {
                jsonschema.items = jsonschema.items.map((i) => normalizeSchema({ ctx, schema: i }))
            } else {
                jsonschema.items = normalizeSchema({ ctx, schema: jsonschema.items })
            }
        }
    } else if (jsonschema.type === 'object') {
        if (jsonschema.properties !== undefined) {
            for (const [key, c] of entriesOf(jsonschema.properties)) {
                jsonschema.properties[key] = normalizeSchema({ ctx, schema: c })
            }
        }
        if (jsonschema.patternProperties !== undefined) {
            for (const [key, c] of entriesOf(jsonschema.patternProperties)) {
                jsonschema.patternProperties[key] = normalizeSchema({ ctx, schema: c })
            }
        }
        if (jsonschema.additionalProperties !== undefined && !isBoolean(jsonschema.additionalProperties)) {
            jsonschema.additionalProperties = normalizeSchema({ ctx, schema: jsonschema.additionalProperties })
        }
    }

    if (jsonschema.title !== undefined) {
        const name = addComponent(ctx, jsonschema)
        ensureTarget(ctx, `#/components/${target}/${name}`, target)
        return { $ref: `#/components/${target}/${name}` }
    }

    return jsonschema
}

export interface OpenapiOptions {
    info: Info
}

export function openapiFromHandlers(handlers: Record<string, unknown>, options: OpenapiOptions) {
    const openapi: OpenapiV3 = {
        openapi: '3.0.1',
        info: options.info,
        paths: {},
        components: {
            schemas: {
                Error: HttpError.schema,
            },
            requestBodies: {},
            responses: {
                Error: {
                    description: HttpError.schema.description!,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
            },
        },
    }
    for (const h of valuesOf(handlers)) {
        const handler = h as EventHandler
        if ('http' in handler) {
            openapi.paths[handler.http.path] ??= {}

            let requestBody: Reference | RequestBody | undefined = undefined
            const bodySchema = handler.http.schema.body?.schema
            if (bodySchema !== undefined) {
                requestBody = normalizeSchema({
                    ctx: { openapi },
                    schema: bodySchema as Schema,
                    target: 'requestBodies',
                }) as Reference
            }
            const responses: Responses = {}
            for (const [statusCode, response] of entriesOf(handler.http.schema.responses)) {
                responses[statusCode.toString()] = normalizeSchema({
                    ctx: { openapi },
                    schema: response.schema as Schema,
                    target: 'responses',
                }) as Reference
            }
            if (responses.default === undefined && Object.keys(responses).filter((s) => s.startsWith('2')).length > 0) {
                responses.default = {
                    $ref: '#/components/responses/Error',
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
                            schema: value as unknown as Schema,
                        })
                    )
                )
            }

            const path = handler.http.schema.path?.schema as JsonSchema | undefined
            if (path?.properties !== undefined) {
                parameters.push(
                    ...entriesOf(path.properties).map(([name, value]) =>
                        omitUndefined({
                            name: name,
                            in: 'path',
                            required: true,
                            description: value.description,
                            deprecated: value.deprecated,
                            schema: value as unknown as Schema,
                        })
                    )
                )
            }

            const query = handler.http.schema.query?.schema as JsonSchema | undefined
            if (query?.properties !== undefined) {
                normalizeSchema({ ctx: { openapi }, schema: query, defsOnly: true, target: 'parameters' })
                parameters.push(
                    ...entriesOf(query.properties).map(([name, value]) =>
                        omitUndefined({
                            name: name,
                            in: 'query',
                            required: query.required?.includes(name),
                            description: value.description,
                            deprecated: value.deprecated,
                            schema: normalizeSchema({
                                ctx: { openapi },
                                schema: value as unknown as Schema,
                                target: 'parameters',
                            }) as Reference,
                        })
                    )
                )
            }

            openapi.paths[handler.http.path]![handler.http.method] = omitUndefined({
                operationId: handler.operationId,
                summary: handler.summary,
                description: handler.description,
                tags: handler.tags,
                parameters,
                requestBody,
                responses,
            })
        }
    }

    return openapi
}
