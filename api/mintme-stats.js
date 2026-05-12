/**
 * /api/mintme-stats
 *
 * Vercel serverless function that fetches live RogueAI token data from
 * MintMe's public open API and normalizes it for the frontend.
 *
 * Returns:
 *   {
 *     priceMintme: number | null,      // price in MINTME coin
 *     priceUsd:    number | null,      // price in USD
 *     tokensSold:  number | null,      // tokens released to the market
 *     tokensRemaining: number | null,  // out of TOTAL_SUPPLY
 *     totalSupply: number,             // always 10,000,000 on MintMe
 *     percentSold: number | null,      // 0-100
 *     lastUpdated: string,             // ISO timestamp
 *     stale:       boolean,            // true if served from cache after MintMe failed
 *     source:      'live' | 'cache' | 'fallback'
 *   }
 *
 * Caching: in-memory, 5 minutes. With Vercel cold-starts the cache resets,
 * which is fine - MintMe allows 5 req/sec and we're well under that.
 *
 * MintMe's "remaining" concept:
 *   Every token has a fixed 10,000,000 supply. The creator holds them in a
 *   release schedule and sells to the market. We treat "tokens released to
 *   the market" (i.e. not held by the release schedule) as "tokens already
 *   in the wild", and the rest as "tokens remaining".
 */

const TOKEN_NAME = 'RogueAI'
const TOTAL_SUPPLY = 10_000_000
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes
const FETCH_TIMEOUT_MS = 8000

// In-memory cache (per serverless instance)
let cache = {
  data: null,
  timestamp: 0,
}

/**
 * Fetch with a timeout so a slow MintMe response doesn't hang the function.
 */
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

/**
 * Safely parse a number from various API response shapes.
 */
function num(value) {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

/**
 * Pull the RogueAI/MINTME market data.
 *
 * Endpoint shape (open, no auth required):
 *   GET https://www.mintme.com/dev/api/v2/open/markets/tickers
 *   Returns an object keyed by symbol pair (e.g. "ROGUEAI_MINTME") with
 *   { last_price, base_volume, quote_volume, isFrozen, ... }
 *
 * Also try:
 *   GET https://www.mintme.com/dev/api/open/v2/info?ticker_id=ROGUEAI_MINTME
 */
async function fetchTokenData() {
  // Try the tickers endpoint - most reliable open endpoint
  const tickersUrl = 'https://www.mintme.com/dev/api/v2/open/markets/tickers'

  let tickerData = null
  try {
    const res = await fetchWithTimeout(tickersUrl, FETCH_TIMEOUT_MS)
    if (res.ok) {
      const json = await res.json()
      // Response is keyed by trading pair. Look for any pair where our token
      // is involved. MintMe pair convention: TOKEN_MINTME
      const upper = TOKEN_NAME.toUpperCase()
      const keys = Object.keys(json || {})
      const match = keys.find(
        (k) => k.toUpperCase() === `${upper}_MINTME` || k.toUpperCase() === `MINTME_${upper}`,
      )
      if (match) tickerData = json[match]
    }
  } catch (e) {
    // swallow - we'll fall back to cache or null
  }

  // Try to get the MINTME -> USD rate so we can convert.
  // MintMe exposes coin price via CoinGecko / CoinMarketCap; for a no-auth
  // path we'll try the same tickers payload (some entries are MINTME_USD-ish)
  // and fall back to CoinGecko if needed.
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
  } catch (e) {
    // ignore - usd will be null
  }

  if (!tickerData) {
    return null
  }

  // Extract price (in MINTME per RogueAI)
  const priceMintme =
    num(tickerData.last_price) ??
    num(tickerData.last) ??
    num(tickerData.lastPrice) ??
    null

  const priceUsd =
    priceMintme !== null && mintmeUsd !== null
      ? priceMintme * mintmeUsd
      : null

  // For tokensSold/tokensRemaining we'd ideally have an endpoint returning
  // the creator's release schedule + circulating supply. MintMe doesn't
  // expose this on the open API in a clean way, so we approximate from
  // 24h volume + base_volume as a directional signal, but if a known
  // "available" field is present we prefer it.
  const tokensSold =
    num(tickerData.tokens_sold) ??
    num(tickerData.sold) ??
    num(tickerData.distributed) ??
    null

  const tokensRemaining =
    num(tickerData.tokens_available) ??
    num(tickerData.available) ??
    (tokensSold !== null ? Math.max(0, TOTAL_SUPPLY - tokensSold) : null)

  const percentSold =
    tokensSold !== null
      ? Math.min(100, Math.max(0, (tokensSold / TOTAL_SUPPLY) * 100))
      : tokensRemaining !== null
      ? Math.min(100, Math.max(0, ((TOTAL_SUPPLY - tokensRemaining) / TOTAL_SUPPLY) * 100))
      : null

  return {
    priceMintme,
    priceUsd,
    tokensSold,
    tokensRemaining,
    totalSupply: TOTAL_SUPPLY,
    percentSold,
    volume24hMintme: num(tickerData.base_volume) ?? num(tickerData.quote_volume) ?? null,
    lastUpdated: new Date().toISOString(),
  }
}

export default async function handler(req, res) {
  // CORS - allow your own site to call this
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  const now = Date.now()
  const cacheAge = now - cache.timestamp

  // Serve fresh cache if still warm
  if (cache.data && cacheAge < CACHE_TTL_MS) {
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    res.status(200).json({ ...cache.data, source: 'cache' })
    return
  }

  // Try to fetch fresh
  let fresh = null
  try {
    fresh = await fetchTokenData()
  } catch (e) {
    fresh = null
  }

  if (fresh) {
    cache = { data: { ...fresh, stale: false }, timestamp: now }
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    res.status(200).json({ ...cache.data, source: 'live' })
    return
  }

  // Fresh failed. If we have any cache (even expired), use it.
  if (cache.data) {
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    res.status(200).json({ ...cache.data, stale: true, source: 'cache' })
    return
  }

  // No data at all. Return a sane fallback so the UI never breaks.
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
  })
}
