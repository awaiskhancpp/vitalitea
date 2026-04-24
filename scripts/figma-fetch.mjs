#!/usr/bin/env node
/**
 * Figma REST client with throttling: one HTTP request, then wait 10–20s before the next.
 * Reduces 429 Too Many Requests when pulling several nodes or re-running often.
 *
 * Usage:
 *   FIGMA_ACCESS_TOKEN=xxx node scripts/figma-fetch.mjs <fileKey> <nodeId> [nodeId ...]
 *   pnpm figma:fetch -- <fileKey> <nodeId>
 *
 * Options:
 *   --batch          One request with all node IDs (no delay between; faster, heavier response)
 *   --out=<path>     Write JSON to file instead of stdout
 *   --min-ms=10000   Minimum delay between sequential requests (default 10000)
 *   --max-ms=20000   Maximum delay (default 20000)
 *
 * Token: https://www.figma.com/developers/api#access-tokens
 * Load from env: FIGMA_ACCESS_TOKEN or FIGMA_TOKEN
 */

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { config } from 'dotenv'

config()

const token = process.env.FIGMA_ACCESS_TOKEN || process.env.FIGMA_TOKEN
if (!token) {
  console.error(
    'Missing FIGMA_ACCESS_TOKEN (or FIGMA_TOKEN). Add it to .env or export it in the shell.',
  )
  process.exit(1)
}

function normalizeNodeId(id) {
  return String(id).replace(/-/g, ':')
}

function parseArgs(argv) {
  const args = []
  let batch = false
  let outPath = null
  let minMs = 10_000
  let maxMs = 20_000

  for (const a of argv) {
    if (a === '--batch') batch = true
    else if (a.startsWith('--out=')) outPath = a.slice('--out='.length)
    else if (a.startsWith('--min-ms=')) minMs = Number(a.slice('--min-ms='.length))
    else if (a.startsWith('--max-ms=')) maxMs = Number(a.slice('--max-ms='.length))
    else if (!a.startsWith('--')) args.push(a)
  }

  if (minMs < 0 || maxMs < minMs) {
    console.error('Invalid --min-ms / --max-ms')
    process.exit(1)
  }

  return { positional: args, batch, outPath, minMs, maxMs }
}

function randomDelayMs(minMs, maxMs) {
  return minMs + Math.floor(Math.random() * (maxMs - minMs + 1))
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms))
}

async function fetchNodes(fileKey, ids) {
  const q = ids.map(normalizeNodeId).join(',')
  const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(q)}`
  const res = await fetch(url, {
    headers: { 'X-Figma-Token': token },
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`Figma ${res.status}: ${text.slice(0, 500)}`)
  }
  return JSON.parse(text)
}

const { positional, batch, outPath, minMs, maxMs } = parseArgs(process.argv.slice(2))

if (positional.length < 2) {
  console.error(
    'Usage: node scripts/figma-fetch.mjs <fileKey> <nodeId> [nodeId ...] [--batch] [--out=file.json]',
  )
  process.exit(1)
}

const [fileKey, ...rawNodeIds] = positional
const nodeIds = rawNodeIds.map(normalizeNodeId)

async function main() {
  let combined = { name: 'figma-batch', fileKey, nodes: {} }

  if (batch || nodeIds.length === 1) {
    const data = await fetchNodes(fileKey, nodeIds)
    combined = data
  } else {
    for (let i = 0; i < nodeIds.length; i++) {
      if (i > 0) {
        const wait = randomDelayMs(minMs, maxMs)
        console.error(`[figma-fetch] Waiting ${(wait / 1000).toFixed(1)}s before next request…`)
        await sleep(wait)
      }
      const id = nodeIds[i]
      console.error(`[figma-fetch] Request ${i + 1}/${nodeIds.length}: ${id}`)
      const data = await fetchNodes(fileKey, [id])
      Object.assign(combined.nodes, data.nodes ?? {})
    }
  }

  const json = JSON.stringify(combined, null, 2)
  if (outPath) {
    const p = resolve(outPath)
    writeFileSync(p, json, 'utf8')
    console.error(`[figma-fetch] Wrote ${p}`)
  } else {
    console.log(json)
  }
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
