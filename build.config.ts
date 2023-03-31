import glob from 'fast-glob'

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
async function main() {
    execFileSync(`rm`, ['-rf', 'dist'], { stdio: 'inherit', cwd: __dirname })
    execFileSync('npx', ['tsc', '-p', 'tsconfig.dist.json'], { stdio: 'inherit', cwd: __dirname })

    const srcDir = path.join(__dirname, 'src')
    await Promise.all(
        [...new Set((await glob(path.join(srcDir, '**/*.schema.js'))).map((x) => path.dirname(x)))].map((d) =>
            fs.promises.cp(d, path.join(__dirname, 'dist', path.relative(srcDir, d)), { recursive: true })
        )
    )
}
main().catch((err) => {
    console.error(err)
    process.exit(1)
})
