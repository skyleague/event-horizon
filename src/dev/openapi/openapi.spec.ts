import { alpha, array, entriesOf, forAll, json, omit, omitUndefined, random, record, string, tuple } from '@skyleague/axioms'
import { describe, expect, it, vi } from 'vitest'
import { HttpError } from '../../events/http/functions/http-error.type.js'
import { httpApiHandler } from '../../events/http/http.js'
import { addComponent, ensureTarget, jsonptrToName, normalizeSchema, openapiFromHandlers } from './openapi.js'

describe('jsonptrToName', () => {
    it('refs schemas', () => {
        forAll(
            tuple(
                array(alpha({ minLength: 1 })).map((xs) => xs.join('/')),
                alpha({ minLength: 1 }),
            ),
            ([ptr, name]) => {
                expect(jsonptrToName(`#${ptr}/${name}`)).toEqual(name)
            },
        )
    })
})

describe('addComponent', () => {
    let openapi: any = {}
    it('adds components', () => {
        forAll(tuple(string(), record(json())), ([title, schema]) => {
            openapi = {}
            expect(addComponent({ openapi } as any, { ...schema, title })).toEqual(title)
            expect(openapi.components.schemas[title]).toEqual({ ...schema, title })
        })
    })

    it('only adds first value', () => {
        forAll(tuple(string(), record(json()), record(json())), ([title, schema1, schema2]) => {
            openapi = {}
            expect(addComponent({ openapi } as any, { ...schema1, title })).toEqual(title)
            expect(addComponent({ openapi } as any, { ...schema2, title })).toEqual(title)
            expect(openapi.components.schemas[title]).toEqual({ ...schema1, title })
        })
    })
})

describe('ensureTarget', () => {
    let openapi: any = {}
    it.each(['requestBodies', 'responses'] as const)('content $target', (target) => {
        forAll(
            tuple(
                array(alpha({ minLength: 1 }), { minLength: 1 }).map((xs) => xs.join('/')),
                alpha({ minLength: 1 }),
            ),
            ([ptr, name]) => {
                openapi = {}
                ensureTarget({ openapi } as any, `#/${ptr}/${name}`, target)
                expect(openapi.components[target][name]).toEqual({
                    description: '',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: `#/components/schemas/${name}`,
                            },
                        },
                    },
                })
            },
        )
    })

    it('parameters', () => {
        forAll(
            tuple(
                array(alpha({ minLength: 1 }), { minLength: 1 }).map((xs) => xs.join('/')),
                alpha({ minLength: 1 }),
            ),
            ([ptr, name]) => {
                openapi = {}
                ensureTarget({ openapi } as any, `#/${ptr}/${name}`, 'parameters')
                expect(openapi.components.parameters[name]).toEqual({
                    $ref: `#/components/schemas/${name}`,
                })
            },
        )
    })

    it('schemas', () => {
        forAll(
            tuple(
                array(alpha({ minLength: 1 }), { minLength: 1 }).map((xs) => xs.join('/')),
                alpha({ minLength: 1 }),
            ),
            ([ptr, name]: [string, string]) => {
                openapi = {}
                ensureTarget({ openapi } as any, `#/${ptr}/${name}`, 'schemas')
                expect(openapi.components.schemas).toEqual({})
            },
        )
    })
})

describe('normalizeSchema', () => {
    let openapi: any = {}
    it('refs schemas', () => {
        forAll(
            tuple(
                record(json()),
                array(alpha({ minLength: 1 }), { minLength: 1 }).map((xs) => xs.join('/')),
                alpha({ minLength: 1 }),
            ).map(([jsonschema, ptr, name]) => [{ ...jsonschema, $ref: `#/${ptr}/${name}` }, ptr, name] as const),
            ([jsonschema, ptr, name]) => {
                openapi = {}
                expect(normalizeSchema({ ctx: { openapi } as any, schema: jsonschema as any })).toEqual({
                    ...jsonschema,
                    $ref: `#/${ptr}/${name}`,
                })
                expect(openapi.components.schemas).toEqual({})
            },
        )
    })

    it('refs parameters', () => {
        forAll(
            tuple(
                record(json()),
                array(alpha({ minLength: 1 }), { minLength: 1 }).map((xs) => xs.join('/')),
                alpha({ minLength: 1 }),
            ).map(([jsonschema, ptr, name]) => [{ ...jsonschema, $ref: `#/${ptr}/${name}` }, ptr, name] as const),
            ([jsonschema, ptr, name]) => {
                openapi = {}
                expect(normalizeSchema({ ctx: { openapi } as any, schema: jsonschema as any, target: 'parameters' })).toEqual({
                    ...jsonschema,
                    $ref: `#/${ptr}/${name}`,
                })
                expect(openapi.components.parameters[name]).toEqual({
                    $ref: `#/components/schemas/${name}`,
                })
            },
        )
    })

    it.each(['requestBodies', 'responses'] as const)('refs $target', (target) => {
        forAll(
            tuple(
                record(json()),
                array(alpha({ minLength: 1 }), { minLength: 1 }).map((xs) => xs.join('/')),
                alpha({ minLength: 1 }),
            ).map(([jsonschema, ptr, name]) => [{ ...jsonschema, $ref: `#/${ptr}/${name}` }, ptr, name] as const),
            ([jsonschema, ptr, name]) => {
                openapi = {}
                expect(normalizeSchema({ ctx: { openapi } as any, schema: jsonschema as any, target: target })).toEqual({
                    ...jsonschema,
                    $ref: `#/${ptr}/${name}`,
                })
                expect(openapi.components[target][name]).toEqual({
                    description: '',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: `#/components/schemas/${name}`,
                            },
                        },
                    },
                })
            },
        )
    })

    it('anyOf with ref', () => {
        forAll(
            tuple(record(json()), record(json()), alpha({ minLength: 1 })).map(
                ([jsonschema, definition, name]) =>
                    [
                        { ...jsonschema, anyOf: [{ $ref: `#/$defs/${name}` }], $defs: { [name]: definition } },
                        definition,
                        name,
                    ] as const,
            ),
            ([jsonschema, definition, name]) => {
                openapi = {}
                expect(normalizeSchema({ ctx: { openapi } as any, schema: jsonschema as any })).toEqual({
                    ...omit(jsonschema, ['$defs']),
                    anyOf: [
                        {
                            $ref: `#/components/schemas/${name}`,
                        },
                    ],
                })
                expect(openapi.components.schemas).toEqual({ [name]: definition })
            },
        )
    })

    it('oneOf with ref', () => {
        forAll(
            tuple(record(json()), record(json()), alpha({ minLength: 1 })).map(
                ([jsonschema, definition, name]) =>
                    [
                        { ...jsonschema, oneOf: [{ $ref: `#/$defs/${name}` }], $defs: { [name]: definition } },
                        definition,
                        name,
                    ] as const,
            ),
            ([jsonschema, definition, name]) => {
                openapi = {}
                expect(normalizeSchema({ ctx: { openapi } as any, schema: jsonschema as any })).toEqual({
                    ...omit(jsonschema, ['$defs']),
                    oneOf: [
                        {
                            $ref: `#/components/schemas/${name}`,
                        },
                    ],
                })
                expect(openapi.components.schemas).toEqual({ [name]: definition })
            },
        )
    })

    it('array with ref', () => {
        forAll(
            tuple(record(json()), record(json()), alpha({ minLength: 1 })).map(
                ([jsonschema, definition, name]) =>
                    [
                        { ...jsonschema, type: 'array', items: { $ref: `#/$defs/${name}` }, $defs: { [name]: definition } },
                        definition,
                        name,
                    ] as const,
            ),
            ([jsonschema, definition, name]) => {
                openapi = {}
                expect(normalizeSchema({ ctx: { openapi } as any, schema: jsonschema as any })).toEqual({
                    ...omit(jsonschema, ['$defs']),
                    items: {
                        $ref: `#/components/schemas/${name}`,
                    },
                })
                expect(openapi.components.schemas).toEqual({ [name]: definition })
            },
        )
    })

    it('array with refs', () => {
        forAll(
            tuple(record(json()), record(json()), alpha({ minLength: 1 })).map(
                ([jsonschema, definition, name]) =>
                    [
                        { ...jsonschema, type: 'array', items: [{ $ref: `#/$defs/${name}` }], $defs: { [name]: definition } },
                        definition,
                        name,
                    ] as const,
            ),
            ([jsonschema, definition, name]) => {
                openapi = {}
                expect(normalizeSchema({ ctx: { openapi } as any, schema: jsonschema as any })).toEqual({
                    ...omit(jsonschema, ['$defs']),
                    items: [
                        {
                            $ref: `#/components/schemas/${name}`,
                        },
                    ],
                })
                expect(openapi.components.schemas).toEqual({ [name]: definition })
            },
        )
    })

    it('object with ref properties', () => {
        forAll(
            tuple(record(json()), record(json()), alpha({ minLength: 1 })).map(
                ([jsonschema, definition, name]) =>
                    [
                        {
                            ...jsonschema,
                            type: 'object',
                            properties: { [name]: { $ref: `#/$defs/${name}` } },
                            $defs: { [name]: definition },
                        },
                        definition,
                        name,
                    ] as const,
            ),
            ([jsonschema, definition, name]) => {
                openapi = {}
                expect(normalizeSchema({ ctx: { openapi } as any, schema: jsonschema as any })).toEqual({
                    ...omit(jsonschema, ['$defs']),
                    properties: { [name]: { $ref: `#/components/schemas/${name}` } },
                })
                expect(openapi.components.schemas).toEqual({ [name]: definition })
            },
        )
    })

    it('object with ref patternProperties', () => {
        forAll(
            tuple(record(json()), record(json()), alpha({ minLength: 1 })).map(
                ([jsonschema, definition, name]) =>
                    [
                        {
                            ...jsonschema,
                            type: 'object',
                            patternProperties: { [name]: { $ref: `#/$defs/${name}` } },
                            $defs: { [name]: definition },
                        },
                        definition,
                        name,
                    ] as const,
            ),
            ([jsonschema, definition, name]) => {
                openapi = {}
                expect(normalizeSchema({ ctx: { openapi } as any, schema: jsonschema as any })).toEqual({
                    ...omit(jsonschema, ['$defs']),
                    patternProperties: { [name]: { $ref: `#/components/schemas/${name}` } },
                })
                expect(openapi.components.schemas).toEqual({ [name]: definition })
            },
        )
    })

    it('object with ref additionalProperties', () => {
        forAll(
            tuple(record(json()), record(json()), alpha({ minLength: 1 })).map(
                ([jsonschema, definition, name]) =>
                    [
                        {
                            ...jsonschema,
                            type: 'object',
                            additionalProperties: { $ref: `#/$defs/${name}` },
                            $defs: { [name]: definition },
                        },
                        definition,
                        name,
                    ] as const,
            ),
            ([jsonschema, definition, name]) => {
                openapi = {}
                expect(normalizeSchema({ ctx: { openapi } as any, schema: jsonschema as any })).toEqual({
                    ...omit(jsonschema, ['$defs']),
                    additionalProperties: { $ref: `#/components/schemas/${name}` },
                })
                expect(openapi.components.schemas).toEqual({ [name]: definition })
            },
        )
    })

    it('object with ref properties to component', () => {
        forAll(
            tuple(record(json()), record(json()), alpha({ minLength: 1 }), string()).map(
                ([jsonschema, definition, name, title]) =>
                    [
                        {
                            ...jsonschema,
                            title,
                            type: 'object',
                            properties: { [name]: { $ref: `#/$defs/${name}` } },
                            $defs: { [name]: definition },
                        },
                        definition,
                        name,
                        title,
                    ] as const,
            ),
            ([jsonschema, definition, name, title]) => {
                openapi = {}
                expect(normalizeSchema({ ctx: { openapi } as any, schema: jsonschema as any })).toEqual({
                    $ref: `#/components/schemas/${title}`,
                })
                expect(openapi.components.schemas).toEqual({
                    [name]: definition,
                    [title]: {
                        ...omit(jsonschema, ['$defs']),
                        properties: { [name]: { $ref: `#/components/schemas/${name}` } },
                    },
                })
            },
        )
    })

    it('definition only object with ref properties', () => {
        forAll(
            tuple(record(json()), record(json()), alpha({ minLength: 1 })).map(
                ([jsonschema, definition, name]) =>
                    [
                        {
                            ...jsonschema,
                            type: 'object',
                            properties: { [name]: { $ref: `#/$defs/${name}` } },
                            $defs: { [name]: definition },
                        },
                        definition,
                        name,
                    ] as const,
            ),
            ([jsonschema, definition, name]) => {
                openapi = {}
                expect(normalizeSchema({ ctx: { openapi } as any, schema: jsonschema as any, defsOnly: true })).toEqual({})
                expect(openapi.components.schemas).toEqual({ [name]: definition })
            },
        )
    })
})

describe('openapiFromHandlers', () => {
    const title = random(string())
    const version = random(string())

    it('simple', () => {
        const h = vi.fn()
        forAll(tuple(string(), string()), ([method, path]) => {
            const helloWorld = httpApiHandler({
                http: {
                    method,
                    path,
                    schema: { responses: {} },
                    bodyType: 'plaintext' as const,
                    handler: h,
                } as any,
            })

            expect(openapiFromHandlers({ helloWorld }, { info: { title, version } })).toEqual({
                components: {
                    requestBodies: {},
                    responses: {
                        Error: {
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                            description: HttpError.schema.description,
                        },
                    },
                    schemas: {
                        Error: HttpError.schema,
                    },
                },
                info: { title, version },
                openapi: '3.0.1',
                paths: { [path]: { [method]: { parameters: [], responses: {} } } },
            })
        })
    })

    it('request body', () => {
        const h = vi.fn()
        forAll(tuple(string(), string(), record(json())), ([method, path, schema]) => {
            const helloWorld = httpApiHandler({
                http: {
                    method,
                    path,
                    schema: { responses: {}, body: { schema } },
                    bodyType: 'plaintext' as const,
                    handler: h,
                } as any,
            })

            expect(openapiFromHandlers({ helloWorld }, { info: { title, version } })).toEqual({
                components: {
                    requestBodies: {},
                    responses: {
                        Error: {
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                            description: HttpError.schema.description,
                        },
                    },
                    schemas: {
                        Error: HttpError.schema,
                    },
                },
                info: { title, version },
                openapi: '3.0.1',
                paths: { [path]: { [method]: { parameters: [], responses: {}, requestBody: schema } } },
            })
        })
    })

    it('response', () => {
        const h = vi.fn()
        forAll(tuple(string(), string(), record(json())), ([method, path, schema]) => {
            const helloWorld = httpApiHandler({
                http: {
                    method,
                    path,
                    schema: { responses: { 200: { schema } } },
                    bodyType: 'plaintext' as const,
                    handler: h,
                } as any,
            })

            expect(openapiFromHandlers({ helloWorld }, { info: { title, version } })).toEqual({
                components: {
                    requestBodies: {},
                    responses: {
                        Error: {
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                            description: HttpError.schema.description,
                        },
                    },
                    schemas: {
                        Error: HttpError.schema,
                    },
                },
                info: { title, version },
                openapi: '3.0.1',
                paths: {
                    [path]: {
                        [method]: {
                            parameters: [],
                            responses: { 200: schema, default: { $ref: '#/components/responses/Error' } },
                        },
                    },
                },
            })
        })
    })

    it('response default overrides', () => {
        const h = vi.fn()
        forAll(tuple(string(), string(), record(json())), ([method, path, schema]) => {
            const helloWorld = httpApiHandler({
                http: {
                    method,
                    path,
                    schema: { responses: { default: { schema } } },
                    bodyType: 'plaintext' as const,
                    handler: h,
                } as any,
            })

            expect(openapiFromHandlers({ helloWorld }, { info: { title, version } })).toEqual({
                components: {
                    requestBodies: {},
                    responses: {
                        Error: {
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                            description: HttpError.schema.description,
                        },
                    },
                    schemas: {
                        Error: HttpError.schema,
                    },
                },
                info: { title, version },
                openapi: '3.0.1',
                paths: {
                    [path]: {
                        [method]: {
                            parameters: [],
                            responses: { default: schema },
                        },
                    },
                },
            })
        })
    })

    it('headers', () => {
        const h = vi.fn()
        forAll(
            tuple(
                string(),
                string(),
                record(record(json())).map((j) => ({ properties: j, type: 'object', required: [] as string[] })),
            ),
            ([method, path, schema]) => {
                const helloWorld = httpApiHandler({
                    http: {
                        method,
                        path,
                        schema: { responses: {}, headers: { schema } },
                        bodyType: 'plaintext' as const,
                        handler: h,
                    } as any,
                })

                expect(openapiFromHandlers({ helloWorld }, { info: { title, version } })).toEqual({
                    components: {
                        requestBodies: {},
                        responses: {
                            Error: {
                                content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                                description: HttpError.schema.description,
                            },
                        },
                        schemas: {
                            Error: HttpError.schema,
                        },
                    },
                    info: { title, version },
                    openapi: '3.0.1',
                    paths: {
                        [path]: {
                            [method]: {
                                parameters: entriesOf(schema.properties).map(([name, value]) =>
                                    omitUndefined({
                                        name: name,
                                        in: 'header',
                                        required: schema.required.includes(name),
                                        description: value.description,
                                        deprecated: value.deprecated,
                                        schema: value,
                                    }),
                                ),
                                responses: {},
                            },
                        },
                    },
                })
            },
        )
    })

    it('path', () => {
        const h = vi.fn()
        forAll(
            tuple(
                string(),
                string(),
                record(record(json())).map((j) => ({ properties: j, type: 'object', required: [] as string[] })),
            ),
            ([method, path, schema]) => {
                const helloWorld = httpApiHandler({
                    http: {
                        method,
                        path,
                        schema: { responses: {}, path: { schema } },
                        bodyType: 'plaintext' as const,
                        handler: h,
                    } as any,
                })

                expect(openapiFromHandlers({ helloWorld }, { info: { title, version } })).toEqual({
                    components: {
                        requestBodies: {},
                        responses: {
                            Error: {
                                content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                                description: HttpError.schema.description,
                            },
                        },
                        schemas: {
                            Error: HttpError.schema,
                        },
                    },
                    info: { title, version },
                    openapi: '3.0.1',
                    paths: {
                        [path]: {
                            [method]: {
                                parameters: entriesOf(schema.properties).map(([name, value]) =>
                                    omitUndefined({
                                        name: name,
                                        in: 'path',
                                        required: true,
                                        description: value.description,
                                        deprecated: value.deprecated,
                                        schema: value,
                                    }),
                                ),
                                responses: {},
                            },
                        },
                    },
                })
            },
        )
    })

    it('query', () => {
        const h = vi.fn()
        forAll(
            tuple(
                string(),
                string(),
                record(record(json())).map((j) => ({ properties: j, type: 'query', required: [] as string[] })),
            ),
            ([method, path, schema]) => {
                const helloWorld = httpApiHandler({
                    http: {
                        method,
                        path,
                        schema: { responses: {}, query: { schema } },
                        bodyType: 'plaintext' as const,
                        handler: h,
                    } as any,
                })

                expect(openapiFromHandlers({ helloWorld }, { info: { title, version } })).toEqual({
                    components: {
                        requestBodies: {},
                        responses: {
                            Error: {
                                content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                                description: HttpError.schema.description,
                            },
                        },
                        schemas: {
                            Error: HttpError.schema,
                        },
                    },
                    info: { title, version },
                    openapi: '3.0.1',
                    paths: {
                        [path]: {
                            [method]: {
                                parameters: entriesOf(schema.properties).map(([name, value]) =>
                                    omitUndefined({
                                        name: name,
                                        in: 'query',
                                        required: schema.required.includes(name),
                                        description: value.description,
                                        deprecated: value.deprecated,
                                        schema: value,
                                    }),
                                ),
                                responses: {},
                            },
                        },
                    },
                })
            },
        )
    })
})
