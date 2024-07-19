import { entriesOf, isArray, isBoolean, omitUndefined, valuesOf } from '@skyleague/axioms'
import type { OpenapiV3 } from '@skyleague/therefore'
import type { JsonSchema } from '@skyleague/therefore/src/json.js'
import type {
    Info,
    Operation,
    Parameter,
    Reference,
    RequestBody,
    Responses,
    Schema,
} from '@skyleague/therefore/src/types/openapi.type.js'
import { HttpError } from '../../events/apigateway/functions/http-error.type.js'
import type { EventHandler } from '../../events/common/types.js'

interface JsonSchemaContext {
    openapi: OpenapiV3
}

export function jsonptrToName(ptr: string) {
    return ptr.replace(/#((.*?)\/)*/, '')
}

export function addComponent(ctx: JsonSchemaContext, schema: JsonSchema | Schema, name?: string): string {
    const { openapi } = ctx

    const component = schema.title ?? name

    if (component === undefined) {
        throw new Error('Component name is required')
    }
    openapi.components ??= {}
    openapi.components.schemas ??= {}
    openapi.components.schemas[component] ??= schema as Schema

    return component
}

export function ensureTarget(
    ctx: JsonSchemaContext,
    ptr: string,
    target: 'parameters' | 'requestBodies' | 'responses' | 'schemas',
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
    const jsonschema = structuredClone(schema) as unknown as JsonSchema
    // biome-ignore lint/performance/noDelete: we need to remove the $schema property
    delete jsonschema.$schema

    if (jsonschema.$defs !== undefined) {
        for (const [name, def] of entriesOf(jsonschema.$defs)) {
            if (def !== undefined) {
                addComponent(ctx, normalizeSchema({ ctx, schema: def }), name)
            }
        }

        // biome-ignore lint/performance/noDelete: we need to remove the $defs property
        delete jsonschema.$defs
    }

    if ('$ref' in jsonschema && jsonschema.$ref !== undefined) {
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
    defaultError?: Schema
}

export function openapiFromHandlers(handlers: Record<string, unknown>, options: OpenapiOptions) {
    const { defaultError = HttpError.schema } = options
    const errorDescription = defaultError.description ?? 'An error occurred'
    const openapi: OpenapiV3 = {
        openapi: '3.0.1',
        info: options.info,
        paths: {},
        components: {
            schemas: {
                Error: defaultError,
            },
            requestBodies: {},
            responses: {
                Error: {
                    description: errorDescription,
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
        if ('http' in handler && handler.http.path !== undefined) {
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
                if (response === null) {
                    responses[statusCode.toString()] = {
                        description: '',
                        content: undefined,
                    }
                } else if ('body' in response) {
                    if (response.body === null) {
                        responses[statusCode.toString()] = {
                            description: '',
                            content: undefined,
                        }
                    } else {
                        const schema = normalizeSchema({
                            ctx: { openapi },
                            schema: response.body.schema as Schema,
                            target: 'responses',
                        }) as Reference
                        responses[statusCode.toString()] = {
                            description: (response as { description?: string })?.description ?? '',
                            content: { 'application/json': { schema } },
                        }
                    }
                } else {
                    const schema = normalizeSchema({
                        ctx: { openapi },
                        schema: response?.schema as Schema,
                        target: 'responses',
                    }) as Reference
                    responses[statusCode.toString()] = {
                        description: (response as { description?: string })?.description ?? '',
                        content: { 'application/json': { schema } },
                    }
                }
            }
            if (responses.default === undefined && Object.keys(responses).filter((s) => s.startsWith('2')).length > 0) {
                responses.default = {
                    description: errorDescription,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/responses/Error' },
                        },
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
                            schema: value as unknown as Schema,
                        } as const),
                    ),
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
                        } as const),
                    ),
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
                        } as const),
                    ),
                )
            }

            const pathItem = openapi.paths[handler.http.path]
            if (pathItem !== undefined && handler.http.method !== undefined) {
                pathItem[handler.http.method] = omitUndefined({
                    operationId: handler.operationId,
                    summary: handler.summary,
                    description: handler.description,
                    deprecated: handler.deprecated,
                    tags: handler.tags,
                    parameters,
                    requestBody,
                    responses,
                } satisfies Operation)
            }
        }
    }

    return openapi
}
