import { $integer, $object, $ref, $string, $validator, $optional, $array, $enum } from '@skyleague/therefore'

export const category = $validator(
    $object({
        id: $integer,
        name: $string,
    })
)

export const tag = $validator(
    $object({
        id: $optional($integer),
        name: $optional($string),
    })
)

export const status = $validator($enum(['available', 'pending', 'sold']))

export const pet = $validator(
    $object(
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
        }
    )
)

export const petArray = $validator($array($ref(pet), { description: 'A list of Pet objects' }))
