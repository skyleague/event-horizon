import { status } from '../lib/models.schema'

import { $object, $ref, $validator } from '@skyleague/therefore'

export const query = $validator(
    $object({
        status: $ref(status),
    })
)
