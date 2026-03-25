import { useState, useEffect } from 'react'

export function useDailyContent() {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/daily-content.json?v=' + Date.now())
      .then(r => r.json())
      .then(data => {
        setContent(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { content, loading }
}
