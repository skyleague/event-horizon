import { build } from 'esbuild'

import { execSync } from 'child_process'
import path from 'path'

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const { jsonLoaderPlugin, nodeExternalsPlugin } = require('@skyleague/node-standards/esbuild.plugins')

async function main() {
    execSync('npx tsc -p tsconfig.dist.json --emitDeclarationOnly')

    await build({
        bundle: true,
        sourcemap: true,
        platform: 'node',
        outfile: path.join(__dirname, '.main.js'),
        entryPoints: [path.join(__dirname, 'index.ts')],
        treeShaking: true,
        plugins: [jsonLoaderPlugin, nodeExternalsPlugin],
    })
}
main().catch((err) => {
    console.error(err)
    process.exit(1)
})
