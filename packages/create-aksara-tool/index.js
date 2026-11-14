#!/usr/bin/env node
// npm create aksara-tool my-tool
// Copies a ready-to-run Next.js converter (Tridatu design, ID/EN, dark mode)
// into ./my-tool. Swap script.config.js to build a tool for another script.
import { cpSync, existsSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const name = process.argv[2]
if (!name || name.startsWith('-')) {
  console.error('Usage: npm create aksara-tool <folder-name>')
  process.exit(1)
}

const target = resolve(process.cwd(), name)
if (existsSync(target) && readdirSync(target).length > 0) {
  console.error(`"${name}" already exists and is not empty. Pick another folder name.`)
  process.exit(1)
}

const template = join(dirname(fileURLToPath(import.meta.url)), 'template')
cpSync(template, target, { recursive: true })

// npm strips .gitignore from published packages, so the template ships it as _gitignore.
if (existsSync(join(target, '_gitignore'))) renameSync(join(target, '_gitignore'), join(target, '.gitignore'))

const pkgPath = join(target, 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
pkg.name = basename(target).toLowerCase().replace(/[^a-z0-9-_.]/g, '-')
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

console.log(`
Created ${name}.

  cd ${name}
  npm install
  npm run dev

Then open http://localhost:3000. To convert a different script, edit
script.config.js: swap toScript/toLatin, the wordmark, the lang tag and
the keyboard layout.
`)
