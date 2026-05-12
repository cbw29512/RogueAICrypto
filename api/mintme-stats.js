/**
 * /api/mintme-stats
 *
 * OAuth-authenticated version. Uses MINTME_OAUTH_CLIENT_ID and
 * MINTME_OAUTH_CLIENT_SECRET environment variables to obtain a Bearer
 * token from MintMe, then queries token data with that token.
 *
 * Add ?debug=1 to see probe results and OAuth state.
 *   https://www.rogueaicrypto.com/api/mintme-stats?debug=1
 */

const TOKEN_NAME = 'RogueAI'
const TOTAL_SUPPLY = 10_000_000
const CACHE_TTL_MS = 5 * 60 * 1000
const FETCH_TIMEOUT_MS = 8000

// Token cache
let cache = { data: null, timestamp: 0 }

// OAuth token cache (typically valid 1h)
let oauthCache = { token: null, expiresAt: 0 }

const OAUTH_CLIENT_ID = process.env.MINTME_OAUTH_CLIENT_ID || ''
const OAUTH_CLIENT_SECRET = process.env.MINTME_OAUTH_CLIENT_SECRET || ''

async function fetchWithTimeout(url, ms, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), ms)
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'RogueAICrypto/1.0 (+https://www.rogueaicrypto.com)',
        ...(options.headers || {}),
      },
    })
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
 * Get an OAuth Bearer token via client_credentials grant.
 * Caches the token until ~5 minutes before its declared expiry.
 */
async function getOAuthToken() {
  const now = Date.now()
  if (oauthCache.token && now < oauthCache.expiresAt) {
    return { token: oauthCache.token, cached: true, error: null }
  }

  if (!OAUTH_CLIENT_ID || !OAUTH_CLIENT_SECRET) {
    return { token: null, cached: false, error: 'Missing OAuth env vars' }
  }

  const url = `https://www.mintme.com/oauth/v2/token?client_id=${encodeURIComponent(
    OAUTH_CLIENT_ID,
  )}&grant_type=client_credentials&client_secret=${encodeURIComponent(
    OAUTH_CLIENT_SECRET,
  )}`

  try {
    const res = await fetchWithTimeout(url, FETCH_TIMEOUT_MS)
    const text = await res.text()
    let json
    try {
      json = JSON.parse(text)
    } catch {
      return {
        token: null,
        cached: false,
        error: `OAuth non-JSON response (status ${res.status}): ${text.slice(0, 200)}`,
      }
    }

    if (!res.ok) {
      return {
        token: null,
        cached: false,
        error: `OAuth status ${res.status}: ${JSON.stringify(json).slice(0, 300)}`,
      }
    }

    const access = json.access_token
    const expiresIn = num(json.expires_in) || 3600 // default 1h
    if (!access) {
      return {
        token: null,
        cached: false,
        error: `OAuth missing access_token: ${JSON.stringify(json).slice(0, 300)}`,
      }
    }

    oauthCache = {
      token: access,
      expiresAt: now + (expiresIn - 300) * 1000, // refresh 5 min before expiry
    }
    return { token: access, cached: false, error: null }
  } catch (e) {
    return {
      token: null,
      cached: false,
      error: `OAuth fetch failed: ${e.message || e}`,
    }
  }
}

/**
 * Probe candidate endpoints with the Bearer token.
 */
async function probeEndpoints(bearer) {
  const upper = TOKEN_NAME.toUpperCase()
  const candidates = [
    'https://www.mintme.com/dev/api/v1/open/tickers',
    'https://www.mintme.com/dev/api/v1/cmc/tickers',
    'https://www.mintme.com/dev/api/v1/cg/tickers',
    'https://www.mintme.com/dev/api/v1/auth/tokens',
    `https://www.mintme.com/dev/api/v1/auth/tokens/${TOKEN_NAME}`,
    `https://www.mintme.com/dev/api/v2/auth/tokens/${TOKEN_NAME}`,
    `https://www.mintme.com/dev/api/v2/auth/info/${TOKEN_NAME}`,
    'https://www.mintme.com/dev/api/v2/auth/markets/tickers',
    'https://www.mintme.com/dev/api/v2/open/markets/tickers',
    `https://www.mintme.com/dev/api/v2/open/info/${TOKEN_NAME}`,
  ]

  const headers = bearer ? { Authorization: `Bearer ${bearer}` } : {}

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
      const res = await fetchWithTimeout(url, FETCH_TIMEOUT_MS, { headers })
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
    const oauth = await getOAuthToken()
    const probes = oauth.token ? await probeEndpoints(oauth.token) : []
    const mintmeUsd = await fetchMintmeUsd()
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({
      hasClientId: !!OAUTH_CLIENT_ID,
      clientIdLen: OAUTH_CLIENT_ID.length,
      hasClientSecret: !!OAUTH_CLIENT_SECRET,
      clientSecretLen: OAUTH_CLIENT_SECRET.length,
      oauth: {
        gotToken: !!oauth.token,
        cached: oauth.cached,
        error: oauth.error,
      },
      mintmeUsd,
      probes,
    })
    return
  }

  // Non-debug: fallback for now
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
    note: 'Append ?debug=1 to see OAuth + probe results.',
  })
}
