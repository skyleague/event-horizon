import { $array, $enum, $integer, $object, $optional, $ref, $string } from '@skyleague/therefore'

export const category = $object({
    id: $integer,
    name: $string,
}).validator()

export const tag = $object({
    id: $optional($integer),
    name: $optional($string),
}).validator()

export const status = $enum(['available', 'pending', 'sold']).validator()

export const pet = $object(
    {
        id: $optional($integer),
        category: $optional($ref(category)),
        name: $string,
        photoUrls: $array($string),
        tags: $optional($array($ref(tag))),
        status: $optional(status),
    },
    {
        description: 'Pet object from the store',
    },
).validator()

export const petArray = $array($ref(pet), { description: 'A list of Pet objects' }).validator()
