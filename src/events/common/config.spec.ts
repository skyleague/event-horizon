import { array, constant, forAll, json, set, string, tuple, unknown, zip } from '@skyleague/axioms'
import { expect, expectTypeOf, it } from 'vitest'
import { asConfig } from './config.js'

it('erases the correct types', () => {
    expectTypeOf(asConfig({ foo: 'bar' }).foo).toEqualTypeOf<'bar'>()
    expectTypeOf(asConfig({ foo: 'bar' } as { foo: string | undefined }).foo).toEqualTypeOf<string>()
    expectTypeOf(asConfig({ foo: 'bar' } as { foo?: string | undefined }).foo).toEqualTypeOf<string | undefined>()
})

it('gives the object as given', () => {
    expect(asConfig({ foo: 'bar' }).foo).toEqual('bar')
    const { foo } = asConfig({ foo: 'bar' })
    expect(foo).toEqual('bar')
})

it('can retrieve all values set', () => {
    forAll(
        set(string())
            .chain((keys) => {
                return tuple(constant(keys), array(json(), { minLength: keys.length, maxLength: keys.length }))
            })
            .map(([keys, values]) => zip(keys, values).toArray()),
        (xs) => {
            const values = Object.fromEntries(xs)
            const proxy = asConfig(values)
            for (const [key, value] of xs) {
                expect(proxy[key]).toEqual(value)
            }
        },
    )
})

it('throws an error when it fetches an undefined field', () => {
    forAll(
        set(string())
            .chain((keys) => {
                return tuple(
                    constant(keys),
                    array(unknown({ undefined: true }), { minLength: keys.length, maxLength: keys.length }),
                )
            })
            .map(([keys, values]) => zip(keys, values).toArray()),
        (xs) => {
            const values = Object.fromEntries(xs)
            const proxy = asConfig(values)
            for (const [key, value] of xs) {
                if (values[key] === undefined) {
                    expect(() => proxy[key]).toThrowError(
                        `Field ${key} is undefined, please make sure your configuration is properly initialized`,
                    )
                } else {
                    expect(proxy[key]).toEqual(value)
                }
            }
        },
    )
})
