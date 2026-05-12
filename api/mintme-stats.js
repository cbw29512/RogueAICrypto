/**
 * /api/mintme-stats
 *
 * DIAGNOSTIC VERSION - tries multiple MintMe endpoint patterns and reports
 * which one (if any) returns our token's data. Once we know the working
 * endpoint and response shape, we'll simplify this back down.
 *
 * Add ?debug=1 to the URL to see the raw probe results:
 *   https://www.rogueaicrypto.com/api/mintme-stats?debug=1
 */

const TOKEN_NAME = 'RogueAI'
const TOTAL_SUPPLY = 10_000_000
const CACHE_TTL_MS = 5 * 60 * 1000
const FETCH_TIMEOUT_MS = 8000

let cache = { data: null, timestamp: 0 }

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'RogueAICrypto/1.0 (+https://www.rogueaicrypto.com)',
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
 * Try a list of candidate endpoint URLs. For each, record:
 *   - HTTP status
 *   - first 800 chars of response body
 *   - JSON parse success
 *   - whether RogueAI / ROGUEAI appears in the body
 */
async function probeEndpoints() {
  const upper = TOKEN_NAME.toUpperCase()
  const candidates = [
    // CoinMarketCap-style standard endpoints
    'https://www.mintme.com/dev/api/v2/open/markets/tickers',
    'https://www.mintme.com/dev/api/v2/open/v2/24hr',
    'https://www.mintme.com/dev/api/v2/open/markets/summary',
    'https://www.mintme.com/dev/api/v2/open/v2/summary',
    // CoinGecko-style standard endpoints
    'https://www.mintme.com/dev/api/v1/cg/tickers',
    'https://www.mintme.com/dev/api/v1/cmc/tickers',
    'https://www.mintme.com/dev/api/v1/open/tickers',
    // Token-specific
    `https://www.mintme.com/dev/api/v2/open/info/${TOKEN_NAME}`,
    `https://www.mintme.com/dev/api/v2/open/markets/${TOKEN_NAME}/MINTME`,
    `https://www.mintme.com/dev/api/v2/open/markets/${upper}_MINTME`,
    // Public site JSON
    `https://www.mintme.com/token/${TOKEN_NAME}/info`,
  ]

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
      const res = await fetchWithTimeout(url, FETCH_TIMEOUT_MS)
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

async function fetchTokenData() {
  const probes = await probeEndpoints()

  let mintmeUsd = null
  try {
    const cgRes = await fetchWithTimeout(
      'https://api.coingecko.com/api/v3/simple/price?ids=mintme-com-coin&vs_currencies=usd',
      FETCH_TIMEOUT_MS,
    )
    if (cgRes.ok) {
      const cgJson = await cgRes.json()
      mintmeUsd = num(cgJson?.['mintme-com-coin']?.usd)
    }
  } catch {}

  return { probes, mintmeUsd, stats: null }
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
    let fresh = null
    try {
      fresh = await fetchTokenData()
    } catch (e) {
      fresh = { probes: [], mintmeUsd: null, stats: null, error: e.message }
    }
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json(fresh)
    return
  }

  // Non-debug: return fallback for now (we're still figuring out the right
  // endpoint - once we see ?debug=1 output we'll wire the real parsing).
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
    note: 'Append ?debug=1 to see endpoint probe results.',
  })
}
