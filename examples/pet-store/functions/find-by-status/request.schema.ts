import { status } from '../../lib/models.schema.js'

import { $ref, $query } from '@skyleague/therefore'

export const query = $query({
    status: $ref(status),
})
