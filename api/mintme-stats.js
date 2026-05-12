/**
 * /api/mintme-stats
 *
 * Authenticated version. Uses MINTME_API_ID (public key) and optionally
 * MINTME_API_KEY (private key) from Vercel environment variables to call
 * MintMe's REST API and return live RogueAI token data.
 *
 * Add ?debug=1 to see endpoint probe results and pick the working path.
 *   https://www.rogueaicrypto.com/api/mintme-stats?debug=1
 *
 * Once we identify the working endpoint and response shape, we strip
 * the diagnostic probes and ship the lean version.
 */

const TOKEN_NAME = 'RogueAI'
const TOTAL_SUPPLY = 10_000_000
const CACHE_TTL_MS = 5 * 60 * 1000
const FETCH_TIMEOUT_MS = 8000

let cache = { data: null, timestamp: 0 }

const API_ID = process.env.MINTME_API_ID || ''
const API_KEY = process.env.MINTME_API_KEY || ''

async function fetchWithTimeout(url, ms, extraHeaders = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'RogueAICrypto/1.0 (+https://www.rogueaicrypto.com)',
        ...extraHeaders,
      },
    })
    return res
  } finally {
    clearTimeout(timeout)
  }
}

function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

/**
 * Probe a list of candidate endpoints with the X-API-ID header.
 */
async function probeEndpoints() {
  const upper = TOKEN_NAME.toUpperCase()
  const candidates = [
    // v1 authenticated open API
    'https://www.mintme.com/dev/api/v1/open/tickers',
    'https://www.mintme.com/dev/api/v1/cmc/tickers',
    'https://www.mintme.com/dev/api/v1/cg/tickers',
    'https://www.mintme.com/dev/api/v1/auth/tokens',
    `https://www.mintme.com/dev/api/v1/auth/tokens/${TOKEN_NAME}`,
    `https://www.mintme.com/dev/api/v1/open/markets/${TOKEN_NAME}/MINTME`,
    // v2 patterns (some require auth too)
    'https://www.mintme.com/dev/api/v2/auth/markets/tickers',
    `https://www.mintme.com/dev/api/v2/auth/info/${TOKEN_NAME}`,
    // CMC/CG style without "open" prefix
    'https://www.mintme.com/dev/api/v2/markets/tickers',
  ]

  const headers = API_ID ? { 'X-API-ID': API_ID } : {}

  const results = []
  for (const url of candidates) {
    const entry = {
      url,
      ok: false,
      status: null,
      parseOk: false,
      mentionsToken: false,
      preview: null,
      error: null,
    }
    try {
      const res = await fetchWithTimeout(url, FETCH_TIMEOUT_MS, headers)
      entry.status = res.status
      entry.ok = res.ok
      const text = await res.text()
      entry.preview = text.slice(0, 800)
      entry.mentionsToken =
        text.toUpperCase().includes(upper) || text.includes(TOKEN_NAME)
      try {
        JSON.parse(text)
        entry.parseOk = true
      } catch {
        entry.parseOk = false
      }
    } catch (e) {
      entry.error = e.message || String(e)
    }
    results.push(entry)
  }
  return results
}

async function fetchMintmeUsd() {
  try {
    const res = await fetchWithTimeout(
      'https://api.coingecko.com/api/v3/simple/price?ids=mintme-com-coin&vs_currencies=usd',
      FETCH_TIMEOUT_MS,
    )
    if (!res.ok) return null
    const json = await res.json()
    return num(json?.['mintme-com-coin']?.usd)
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  const debug = req.query?.debug === '1' || req.query?.debug === 'true'

  if (debug) {
    const probes = await probeEndpoints()
    const mintmeUsd = await fetchMintmeUsd()
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({
      hasApiId: !!API_ID,
      apiIdLen: API_ID.length,
      hasApiKey: !!API_KEY,
      apiKeyLen: API_KEY.length,
      mintmeUsd,
      probes,
    })
    return
  }

  // Non-debug fallback for now - we'll wire real parsing after we see
  // which probe returns our data.
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({
    priceMintme: null,
    priceUsd: null,
    tokensSold: null,
    tokensRemaining: null,
    totalSupply: TOTAL_SUPPLY,
    percentSold: null,
    volume24hMintme: null,
    lastUpdated: new Date().toISOString(),
    stale: true,
    source: 'fallback',
    note: 'Append ?debug=1 to see authenticated probe results.',
  })
}
