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
    validate: require('./schemas/category.schema.js') as ValidateFunction<Category>,
    get schema() {
        return Category.validate.schema
    },
    source: `${__dirname}models.schema`,
    sourceSymbol: 'category',
    is: (o: unknown): o is Category => Category.validate(o) === true,
    assert: (o: unknown) => {
        if (!Category.validate(o)) {
            throw new AjvValidator.ValidationError(Category.validate.errors ?? [])
        }
    },
} as const

export interface Tag {
    id?: number
    name?: string
}

export const Tag = {
    validate: require('./schemas/tag.schema.js') as ValidateFunction<Tag>,
    get schema() {
        return Tag.validate.schema
    },
    source: `${__dirname}models.schema`,
    sourceSymbol: 'tag',
    is: (o: unknown): o is Tag => Tag.validate(o) === true,
    assert: (o: unknown) => {
        if (!Tag.validate(o)) {
            throw new AjvValidator.ValidationError(Tag.validate.errors ?? [])
        }
    },
} as const

export type Status = 'available' | 'pending' | 'sold'

export const Status = {
    validate: require('./schemas/status.schema.js') as ValidateFunction<Status>,
    get schema() {
        return Status.validate.schema
    },
    source: `${__dirname}models.schema`,
    sourceSymbol: 'status',
    is: (o: unknown): o is Status => Status.validate(o) === true,
    assert: (o: unknown) => {
        if (!Status.validate(o)) {
            throw new AjvValidator.ValidationError(Status.validate.errors ?? [])
        }
    },
} as const

export interface Pet {
    id?: number
    category?: Category
    name: string
    photoUrls: string[]
    tags?: Tag[]
    status?: 'available' | 'pending' | 'sold'
}

export const Pet = {
    validate: require('./schemas/pet.schema.js') as ValidateFunction<Pet>,
    get schema() {
        return Pet.validate.schema
    },
    source: `${__dirname}models.schema`,
    sourceSymbol: 'pet',
    is: (o: unknown): o is Pet => Pet.validate(o) === true,
    assert: (o: unknown) => {
        if (!Pet.validate(o)) {
            throw new AjvValidator.ValidationError(Pet.validate.errors ?? [])
        }
    },
} as const

export type PetArray = Pet[]

export const PetArray = {
    validate: require('./schemas/pet-array.schema.js') as ValidateFunction<PetArray>,
    get schema() {
        return PetArray.validate.schema
    },
    source: `${__dirname}models.schema`,
    sourceSymbol: 'petArray',
    is: (o: unknown): o is PetArray => PetArray.validate(o) === true,
    assert: (o: unknown) => {
        if (!PetArray.validate(o)) {
            throw new AjvValidator.ValidationError(PetArray.validate.errors ?? [])
        }
    },
} as const
