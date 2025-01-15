import { entriesOf, isArray, isBoolean, omit, omitUndefined, valuesOf } from '@skyleague/axioms'
import type { Node, OpenapiV3 } from '@skyleague/therefore'
import type { JsonSchema } from '@skyleague/therefore/src/json.js'
import { Therefore } from '@skyleague/therefore/src/lib/primitives/therefore.js'
import type {
    Info,
    Operation,
    Parameter,
    Reference,
    RequestBody,
    Responses,
    Schema,
} from '@skyleague/therefore/src/types/openapi.type.js'
import type { ZodNumber } from 'zod'
import { EventError } from '../../errors/event-error/event-error.js'
import { HttpError } from '../../events/apigateway/event/functions/http-error.type.js'
import type { SecurityRequirement, SecurityRequirements } from '../../events/apigateway/types.js'
import type { EventHandler } from '../../events/common/types.js'
import type { GenericParser } from '../../parsers/types.js'

interface JsonSchemaContext {
    openapi: OpenapiV3
}

let $ref: typeof import('@skyleague/therefore')['$ref'] | undefined
try {
    ;({ $ref } = await import('@skyleague/therefore'))
} catch {
    $ref = undefined
}

export function genericJsonSchema<T extends GenericParser>(
    parser: T | undefined | null,
    suggestedName: string,
): Promise<JsonSchema> | JsonSchema | undefined {
    if (!parser) {
        return undefined
    }

    if ('_def' in parser) {
        // Convert Zod schema to Therefore schema and then to JSON Schema
        if ($ref) {
            const node: Node = $ref(parser as ZodNumber)
            return Therefore.jsonschema(node, { fallbackName: suggestedName })
        }
    }

    // Therefore parser
    if ('schema' in parser) {
        return parser.schema as JsonSchema
    }

    // TypeSchema parser
    // return makeSynchronous(() => toJSONSchema(parser)) as JsonSchema
    return undefined
}

export function jsonptrToName(ptr: string) {
    return ptr.replace(/#((.*?)\/)*/, '')
}

export function addComponent({
    ctx,
    schema,
    name,
    sanitize = true,
}: { ctx: JsonSchemaContext; schema: JsonSchema | Schema; name?: string; sanitize?: boolean }): string {
    const { openapi } = ctx

    const _component = schema.title ?? name
    const component = sanitize ? _component?.replace(/[^a-zA-Z0-9]/g, '-') : _component

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

export function normalizeSecurity(security: SecurityRequirements | undefined): SecurityRequirement[] | undefined {
    if (security === undefined) {
        return undefined
    }
    if (isArray(security)) {
        return security
    }

    return [security]
}

function convertToOpenAPISchema(schema: JsonSchema, openapiVersion: '3.0.1' | '3.1.0'): JsonSchema {
    if (openapiVersion === '3.0.1') {
        // OpenAPI 3.0.1 doesn't support certain JSON Schema features
        const converted = { ...schema } as JsonSchema

        // Remove unsupported keywords
        // delete converted.contentEncoding
        // delete converted.contentMediaType
        // delete converted.contentSchema
        // delete converted.if
        // delete converted.then
        // delete converted.else
        // delete converted.unevaluatedProperties
        // delete converted.unevaluatedItems

        // Convert null
        if (converted.type === 'null') {
            converted.type = 'string'
            converted.enum = [null]
            converted.nullable = true
        }
        if (Array.isArray(converted.type) && converted.type.includes('null')) {
            const types = converted.type.filter((t) => t !== 'null')
            converted.type = types.length === 1 ? types[0] : types
            converted.nullable = true
        }

        // Convert inclusive min/max to OpenAPI 3.0.1 format
        if (
            converted.exclusiveMinimum !== undefined &&
            (typeof converted.exclusiveMinimum === 'number' || typeof converted.exclusiveMinimum === 'boolean')
        ) {
            if (typeof converted.exclusiveMinimum === 'number') {
                converted.minimum = converted.exclusiveMinimum
                converted.exclusiveMinimum = true as never
            }
        }
        if (
            converted.exclusiveMaximum !== undefined &&
            (typeof converted.exclusiveMaximum === 'number' || typeof converted.exclusiveMaximum === 'boolean')
        ) {
            if (typeof converted.exclusiveMaximum === 'number') {
                converted.maximum = converted.exclusiveMaximum
                converted.exclusiveMaximum = true as never
            }
        }

        return converted
    }

    // OpenAPI 3.1.0 supports full JSON Schema 2020-12
    return schema as JsonSchema
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
    // check by reference
    if (schema === EventError.schema) {
        return { $ref: '#/components/responses/ErrorResponse' }
    }
    const jsonschema = structuredClone(schema) as unknown as JsonSchema
    // biome-ignore lint/performance/noDelete: we need to remove the $schema property
    delete jsonschema.$schema

    // Convert schema to OpenAPI compatible version
    const converted = convertToOpenAPISchema(jsonschema, ctx.openapi.openapi as '3.0.1' | '3.1.0')

    if (converted.$defs !== undefined) {
        for (const [name, def] of entriesOf(converted.$defs)) {
            if (def !== undefined) {
                addComponent({ ctx, schema: normalizeSchema({ ctx, schema: def }), name })
            }
        }

        // biome-ignore lint/performance/noDelete: we need to remove the $defs property
        delete converted.$defs
    }

    if ('$ref' in converted && converted.$ref !== undefined) {
        ensureTarget(ctx, converted.$ref, target)
        return { ...converted, $ref: converted.$ref.replace('#/$defs/', `#/components/${target}/`) }
    }

    if (defsOnly) {
        return {}
    }
    if (converted.anyOf !== undefined) {
        converted.anyOf = converted.anyOf.map((i) => normalizeSchema({ ctx, schema: i }))
    }
    if (converted.oneOf !== undefined) {
        converted.oneOf = converted.oneOf.map((i) => normalizeSchema({ ctx, schema: i }))
    }

    if (converted.type === 'array') {
        if (converted.items !== undefined) {
            if (isArray(converted.items)) {
                converted.items = converted.items.map((i) => normalizeSchema({ ctx, schema: i }))
            } else {
                converted.items = normalizeSchema({ ctx, schema: converted.items })
            }
        }
    } else if (converted.type === 'object') {
        if (converted.properties !== undefined) {
            for (const [key, c] of entriesOf(converted.properties)) {
                converted.properties[key] = normalizeSchema({ ctx, schema: c })
            }
        }
        if (converted.patternProperties !== undefined) {
            for (const [key, c] of entriesOf(converted.patternProperties)) {
                converted.patternProperties[key] = normalizeSchema({ ctx, schema: c })
            }
        }
        if (converted.additionalProperties !== undefined && !isBoolean(converted.additionalProperties)) {
            converted.additionalProperties = normalizeSchema({ ctx, schema: converted.additionalProperties })
        }
    }

    if (converted.title !== undefined) {
        const name = addComponent({ ctx, schema: converted })
        ensureTarget(ctx, `#/components/${target}/${name}`, target)
        return { $ref: `#/components/${target}/${name}` }
    }

    return converted
}

export interface OpenapiOptions extends Partial<OpenapiV3> {
    // restrict down
    openapi?: '3.0.1' | '3.1.0'
    info: Info
    defaultError?: Schema
}

export async function openapiFromHandlers(handlers: Record<string, unknown>, options: OpenapiOptions) {
    const { defaultError = HttpError.schema, openapi: targetOpenapi = '3.1.0' } = options
    const errorDescription = (defaultError as { description?: string }).description ?? 'An error occurred'

    // Track schema frequencies for jsonSchemaDialect
    // const schemaFrequencies = new Map<string, number>()
    // const trackSchema = (schema: JsonSchema | undefined) => {
    //     if (schema?.$schema) {
    //         schemaFrequencies.set(schema.$schema, (schemaFrequencies.get(schema.$schema) ?? 0) + 1)
    //     }
    // }

    const openapi: OpenapiV3 = {
        openapi: targetOpenapi,
        ...omit(options, ['defaultError']),
        paths: {},
        components: {
            ...options.components,
            schemas: {
                ErrorResponse: defaultError as Schema,
            },
            requestBodies: {},
            responses: {
                ErrorResponse: {
                    description: errorDescription,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                        },
                    },
                },
            },
        },
    }

    // Collect schema information
    // for (const h of valuesOf(handlers)) {
    //     const handler = h as EventHandler
    //     if ('http' in handler && handler.http.path !== undefined) {
    //         for (const key of ['body', 'query', 'path', 'headers'] as const) {
    //             trackSchema(
    //                 await genericJsonSchema(handler.http.schema[key], `${handler.http.path}-${handler.http.method}-${key}`),
    //             )
    //         }
    //         for (const r of Object.values(handler.http.schema.responses).filter((r): r is NonNullable<typeof r> => r !== null)) {
    //             trackSchema(
    //                 await ('body' in r
    //                     ? genericJsonSchema(r.body, `${handler.http.path}-${handler.http.method}-response`)
    //                     : genericJsonSchema(r, `${handler.http.path}-${handler.http.method}-${r.statusCode}-response`)),
    //             )
    //         }
    //     }
    // }

    // Set jsonSchemaDialect if schemas were found
    // if (targetOpenapi === '3.1.0' && schemaFrequencies.size > 0) {
    //     // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    //     ;(openapi as any).jsonSchemaDialect = Array.from(schemaFrequencies.entries()).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
    // }

    // Process handlers
    for (const h of valuesOf(handlers)) {
        const handler = h as EventHandler
        if ('http' in handler && handler.http.path !== undefined) {
            openapi.paths[handler.http.path] ??= {}

            let requestBody: Reference | RequestBody | undefined = undefined
            const bodyType = handler.http.bodyType ?? 'json'
            // Map handler body types to content types and schemas
            const contentTypeMap = {
                binary: 'application/octet-stream',
                json: 'application/json',
                plaintext: 'text/plain',
            } as const

            const contentType = contentTypeMap[bodyType]

            // For OpenAPI 3.0.1, we need to use specific schema types for non-JSON content
            const bodySchema = await genericJsonSchema(
                handler.http.schema.body,
                `${handler.http.path}-${handler.http.method}-request-body`,
            )
            if (bodySchema !== undefined) {
                // If there's a schema defined, normalize it and create requestBody
                const reference = normalizeSchema({
                    ctx: { openapi },
                    schema: bodySchema,
                    target: 'requestBodies',
                }) as Reference
                requestBody =
                    '$ref' in reference
                        ? reference
                        : {
                              content: {
                                  [contentType]: {
                                      schema: reference,
                                  },
                              },
                          }
            } else if (bodyType !== 'json') {
                // For non-JSON body types, always include requestBody with appropriate schema
                requestBody = {
                    content: {
                        [contentType]: {
                            schema:
                                targetOpenapi === '3.0.1' && bodyType === 'binary' ? { type: 'string', format: 'binary' } : {},
                        },
                    },
                }
            }
            // For JSON bodyType with no schema, requestBody remains undefined
            const responses: Responses = {}
            for (const [statusCode, response] of entriesOf(handler.http.schema.responses)) {
                function asStatusResponse(schema: JsonSchema | Reference) {
                    if ('$ref' in schema) {
                        return schema
                    }
                    return {
                        description: (response as { description?: string })?.description ?? '',
                        content: { 'application/json': { schema } },
                    }
                }
                if (response === null) {
                    responses[statusCode.toString()] = {
                        description: '',
                        content: undefined,
                    }
                } else if ('body' in response) {
                    if (response.body === null) {
                        responses[statusCode.toString()] = {
                            description: (response as { description?: string })?.description ?? '',
                            content: undefined,
                        }
                    } else {
                        const schema = normalizeSchema({
                            ctx: { openapi },
                            schema: (await genericJsonSchema(
                                response.body,
                                `${handler.http.path}-${handler.http.method}-${statusCode}-response`,
                            )) as Schema,
                            target: 'responses',
                        }) as Reference
                        responses[statusCode.toString()] = asStatusResponse(schema)
                    }
                } else {
                    const schema = normalizeSchema({
                        ctx: { openapi },
                        schema: (await genericJsonSchema(
                            response,
                            `${handler.http.path}-${handler.http.method}-${statusCode}-response`,
                        )) as Schema,
                        target: 'responses',
                    }) as Reference
                    responses[statusCode.toString()] = asStatusResponse(schema)
                }
            }
            if (responses.default === undefined && Object.keys(responses).filter((s) => s.startsWith('2')).length > 0) {
                responses.default = { $ref: '#/components/responses/ErrorResponse' }
            }

            const parameters: Parameter[] = []
            const headers = await genericJsonSchema(
                handler.http.schema.headers,
                `${handler.http.path}-${handler.http.method}-headers`,
            )
            if (headers?.properties !== undefined) {
                parameters.push(
                    ...entriesOf(headers.properties).map(([name, value]) =>
                        omitUndefined({
                            name: name,
                            in: 'header',
                            required: headers.required?.includes(name),
                            description: value.description,
                            deprecated: value.deprecated,
                            schema: structuredClone(value) as unknown as Schema,
                        } as const),
                    ),
                )
            }

            const path = await genericJsonSchema(handler.http.schema.path, `${handler.http.path}-${handler.http.method}-path`)
            if (path?.properties !== undefined) {
                parameters.push(
                    ...entriesOf(path.properties).map(([name, value]) =>
                        omitUndefined({
                            name: name,
                            in: 'path',
                            required: true,
                            description: value.description,
                            deprecated: value.deprecated,
                            schema: structuredClone(value) as unknown as Schema,
                        } as const),
                    ),
                )
            }

            const query = await genericJsonSchema(handler.http.schema.query, `${handler.http.path}-${handler.http.method}-query`)
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
                    security: normalizeSecurity(handler.http.security),
                    parameters,
                    requestBody,
                    responses,
                } satisfies Operation)
            }
        }
    }

    return openapi
}
