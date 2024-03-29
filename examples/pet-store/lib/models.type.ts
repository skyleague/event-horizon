/**
 * Generated by @skyleague/therefore@v1.0.0-local
 * Do not manually touch this
 */
/* eslint-disable */
import AjvValidator from 'ajv'
import type { ValidateFunction } from 'ajv'

export interface Category {
    id: number
    name: string
}

export const Category = {
    validate: (await import('./schemas/category.schema.js')).validate10 as unknown as ValidateFunction<Category>,
    get schema() {
        return Category.validate.schema
    },
    get errors() {
        return Category.validate.errors ?? undefined
    },
    is: (o: unknown): o is Category => Category.validate(o) === true,
    assert: (o: unknown) => {
        if (!Category.validate(o)) {
            throw new AjvValidator.ValidationError(Category.errors ?? [])
        }
    },
} as const

/**
 * Pet object from the store
 */
export interface Pet {
    id?: number
    category?: Category
    name: string
    photoUrls: string[]
    tags?: Tag[]
    status?: 'available' | 'pending' | 'sold'
}

export const Pet = {
    validate: (await import('./schemas/pet.schema.js')).validate10 as unknown as ValidateFunction<Pet>,
    get schema() {
        return Pet.validate.schema
    },
    get errors() {
        return Pet.validate.errors ?? undefined
    },
    is: (o: unknown): o is Pet => Pet.validate(o) === true,
    assert: (o: unknown) => {
        if (!Pet.validate(o)) {
            throw new AjvValidator.ValidationError(Pet.errors ?? [])
        }
    },
} as const

/**
 * A list of Pet objects
 */
export type PetArray = Pet[]

export const PetArray = {
    validate: (await import('./schemas/pet-array.schema.js')).validate10 as unknown as ValidateFunction<PetArray>,
    get schema() {
        return PetArray.validate.schema
    },
    get errors() {
        return PetArray.validate.errors ?? undefined
    },
    is: (o: unknown): o is PetArray => PetArray.validate(o) === true,
    assert: (o: unknown) => {
        if (!PetArray.validate(o)) {
            throw new AjvValidator.ValidationError(PetArray.errors ?? [])
        }
    },
} as const

export type Status = 'available' | 'pending' | 'sold'

export const Status = {
    validate: (await import('./schemas/status.schema.js')).validate10 as unknown as ValidateFunction<Status>,
    get schema() {
        return Status.validate.schema
    },
    get errors() {
        return Status.validate.errors ?? undefined
    },
    is: (o: unknown): o is Status => Status.validate(o) === true,
    assert: (o: unknown) => {
        if (!Status.validate(o)) {
            throw new AjvValidator.ValidationError(Status.errors ?? [])
        }
    },
} as const

export interface Tag {
    id?: number
    name?: string
}

export const Tag = {
    validate: (await import('./schemas/tag.schema.js')).validate10 as unknown as ValidateFunction<Tag>,
    get schema() {
        return Tag.validate.schema
    },
    get errors() {
        return Tag.validate.errors ?? undefined
    },
    is: (o: unknown): o is Tag => Tag.validate(o) === true,
    assert: (o: unknown) => {
        if (!Tag.validate(o)) {
            throw new AjvValidator.ValidationError(Tag.errors ?? [])
        }
    },
} as const
