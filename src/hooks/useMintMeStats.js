import { useEffect, useState, useRef } from 'react'

/**
 * useMintMeStats
 *
 * Fetches live RogueAI token stats from /api/mintme-stats.
 * Polls every 5 minutes by default (matches the server cache TTL).
 *
 * Usage:
 *   const { stats, loading, error } = useMintMeStats()
 *
 * stats = {
 *   priceMintme, priceUsd, tokensSold, tokensRemaining,
 *   totalSupply, percentSold, volume24hMintme, lastUpdated,
 *   stale, source
 * }
 */
export function useMintMeStats({ pollMs = 5 * 60 * 1000 } = {}) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const aliveRef = useRef(true)

  useEffect(() => {
    aliveRef.current = true

    async function load() {
      try {
        const res = await fetch('/api/mintme-stats', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (aliveRef.current) {
          setStats(json)
          setError(null)
        }
      } catch (e) {
        if (aliveRef.current) setError(e.message || 'fetch failed')
      } finally {
        if (aliveRef.current) setLoading(false)
      }
    }

    load()
    const interval = setInterval(load, pollMs)

    return () => {
      aliveRef.current = false
      clearInterval(interval)
    }
  }, [pollMs])

  return { stats, loading, error }
}
