import { z } from 'zod'

export const category = z
    .object({
        id: z.number().int(),
        name: z.string(),
    })
    .meta({
        title: 'Category',
    })

export const tag = z
    .object({
        id: z.number().int().optional(),
        name: z.string().optional(),
    })
    .meta({
        title: 'Tag',
    })

export const status = z.enum(['available', 'pending', 'sold']).meta({
    title: 'Status',
})

export const pet = z
    .object({
        id: z.number().int().optional(),
        category: category.optional(),
        name: z.string(),
        photoUrls: z.array(z.string()),
        tags: z.array(tag).optional(),
        status: status.optional(),
    })
    .describe('Pet object from the store')
    .meta({
        title: 'Pet',
    })

export const petArray = z.array(pet).describe('A list of Pet objects').meta({
    title: 'PetArray',
})
