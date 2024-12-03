import { z } from 'zod'

export const category = z.object({
    id: z.number().int(),
    name: z.string(),
})

export const tag = z.object({
    id: z.number().int().optional(),
    name: z.string().optional(),
})

export const status = z.enum(['available', 'pending', 'sold'])

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

export const petArray = z.array(pet).describe('A list of Pet objects')
