import { isObject } from '@skyleague/axioms'
import type { SetNonNullable } from '@skyleague/axioms/types'

export const configTag = Symbol.for('proxy:config')
export type AsConfig<T> = SetNonNullable<T>
export function asConfig<const T>(x: T): AsConfig<T> {
    if (!isObject(x)) {
        return x as unknown as AsConfig<T>
    }
    const proxy = { [configTag]: x }
    for (const key in x) {
        Object.defineProperty(proxy, key, {
            get: () => {
                const val = x[key]
                if (val === undefined) {
                    throw new Error(`Field ${key} is undefined, please make sure your configuration is properly initialized`)
                }
                return val
            },
        })
    }
    return proxy as SetNonNullable<T>
}
