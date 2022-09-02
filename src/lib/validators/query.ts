import type { CstNode, LazyObjectOptions, ObjectPropertiesArg, SchemaOptions } from '@skyleague/therefore'
import { $object, $validator, isCstNode } from '@skyleague/therefore'

export function $query(properties: CstNode | ObjectPropertiesArg, options?: SchemaOptions<LazyObjectOptions>) {
    const validator = $validator(isCstNode(properties) ? properties : $object(properties, options))
    validator.description.ajvOptions = { ...validator.description.ajvOptions, coerceTypes: true }
    return validator
}
