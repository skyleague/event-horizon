import sjson from 'secure-json-parse'

export function parseJSON(x: string): unknown {
    return sjson.parse(x, null, { protoAction: 'remove', constructorAction: 'remove' })
}
