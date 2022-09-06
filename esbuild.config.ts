import packageJson from './package.json'

import { build } from 'esbuild'

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

async function main() {
    execSync('npx tsc -p tsconfig.dist.json --emitDeclarationOnly')

    await build({
        bundle: true,
        sourcemap: true,
        platform: 'node',
        outfile: path.join(__dirname, '.main.js'),
        entryPoints: [path.join(__dirname, 'index.ts')],
        treeShaking: true,
        external: Object.keys({
            ...(packageJson as { devDependencies?: Record<string, string> }).devDependencies,
            ...(packageJson as { peerDependencies?: Record<string, string> }).peerDependencies,
            ...(packageJson as { dependencies?: Record<string, string> }).dependencies,
        }),
        plugins: [
            {
                name: 'json-loader',
                setup: (compiler) => {
                    compiler.onLoad({ filter: /.json$/ }, async (args) => {
                        const content = await fs.promises.readFile(args.path, 'utf-8')
                        return {
                            contents: `module.exports = JSON.parse(${JSON.stringify(JSON.stringify(JSON.parse(content)))})`,
                        }
                    })
                },
            },
        ],
    })
}
main().catch((err) => {
    console.error(err)
    process.exit(1)
})
