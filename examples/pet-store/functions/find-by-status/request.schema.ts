import { status } from '../../lib/models.schema.js'

import { $query, $ref } from '@skyleague/therefore'

export const query = $query({
    status: $ref(status),
})
