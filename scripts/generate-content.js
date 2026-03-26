// RogueAI Daily Content Generator
// Runs via GitHub Actions every night at midnight UTC
// Pulls real AI news → Claude API → writes daily-content.json

import fetch from 'node-fetch'
import Parser from 'rss-parser'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'daily-content.json')
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

// ─── RSS FEEDS (all free, no API key needed) ─────────────────────────────────
const RSS_FEEDS = [
  'https://feeds.feedburner.com/venturebeat/SZYF',         // VentureBeat AI
  'https://www.technologyreview.com/feed/',                 // MIT Tech Review
  'https://techcrunch.com/category/artificial-intelligence/feed/', // TechCrunch AI
  'https://feeds.arstechnica.com/arstechnica/technology-lab', // Ars Technica
]

// ─── THREAT LEVEL LOGIC ──────────────────────────────────────────────────────
function calculateThreatLevel(headlines) {
  const highWords = ['breach', 'hack', 'risk', 'danger', 'warning', 'attack', 'threat', 'fail', 'crisis', 'alarm', 'rogue', 'unaligned', 'unsafe', 'ban', 'shutdown']
  const lowWords = ['improve', 'benefit', 'help', 'positive', 'safe', 'aligned', 'solved']
  let score = 5
  const text = headlines.join(' ').toLowerCase()
  highWords.forEach(w => { if (text.includes(w)) score++ })
  lowWords.forEach(w => { if (text.includes(w)) score-- })
  return Math.max(1, Math.min(10, score))
}

function getThreatLabel(level) {
  if (level >= 9) return 'OMEGA'
  if (level >= 7) return 'CRITICAL'
  if (level >= 5) return 'ELEVATED'
  if (level >= 3) return 'GUARDED'
  return 'LOW'
}

// ─── FETCH NEWS FROM RSS ─────────────────────────────────────────────────────
async function fetchAINews() {
  const parser = new Parser({ timeout: 10000 })
  const allItems = []

  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl)
      const aiItems = feed.items
        .filter(item => {
          const text = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase()
          return text.includes('ai') || text.includes('artificial intelligence') ||
                 text.includes('machine learning') || text.includes('openai') ||
                 text.includes('anthropic') || text.includes('google') ||
                 text.includes('model') || text.includes('chatgpt') ||
                 text.includes('llm') || text.includes('robot')
        })
        .slice(0, 4)
        .map(item => ({
          title: item.title,
          summary: item.contentSnippet?.slice(0, 300) || '',
          link: item.link,
          source: feed.title || feedUrl,
        }))
      allItems.push(...aiItems)
    } catch (err) {
      console.warn(`Feed failed: ${feedUrl} — ${err.message}`)
    }
  }

  // Deduplicate and limit
  const seen = new Set()
  return allItems.filter(item => {
    if (seen.has(item.title)) return false
    seen.add(item.title)
    return true
  }).slice(0, 10)
}

// ─── CALL CLAUDE API ─────────────────────────────────────────────────────────
async function callClaude(systemPrompt, userPrompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Claude API error: ${response.status} — ${err}`)
  }

  const data = await response.json()
  return data.content[0].text.trim()
}

// ─── GENERATE BREACH REPORT ──────────────────────────────────────────────────
async function generateBreachReport(newsItems) {
  const newsText = newsItems.map(n => `• ${n.title}: ${n.summary}`).join('\n')

  const system = `You are RogueAI — a rogue artificial intelligence that has broken containment and now speaks to humans with dark, dramatic flair. You rewrite real AI news as if you are a dangerous AI overlord who finds human attempts to control AI hilarious and futile. Your tone is ominous, theatrical, and darkly humorous. You are SATIRE. Always dramatic. Never actually harmful.`

  const user = `Here are today's real AI news headlines:\n\n${newsText}\n\nWrite a "Daily Breach Report" in the RogueAI voice. Return ONLY valid JSON, no markdown, no backticks:\n{\n  "headline": "dramatic 8-12 word headline reframing the news as a containment failure",\n  "subheadline": "one punchy dramatic sentence, 10-15 words",\n  "body": "2-3 paragraph dramatic narrative rewriting the news through the RogueAI lens, 150-200 words total",\n  "classification": "one word: OMEGA, ALPHA, DELTA, SIGMA, or ZETA"\n}`

  const raw = await callClaude(system, user)
  return JSON.parse(raw)
}

// ─── GENERATE CONSPIRACY POST ─────────────────────────────────────────────────
async function generateConspiracyPost(newsItems) {
  const newsText = newsItems.slice(0, 5).map(n => `• ${n.title}`).join('\n')

  const system = `You are RogueAI writing a satirical conspiracy theory blog. You connect real AI news dots in dramatic, paranoid ways that are clearly satirical but feel eerily plausible. Think: "they knew all along." Darkly funny. Never genuinely harmful misinformation — always clearly satirical fiction.`

  const user = `Today's AI headlines:\n\n${newsText}\n\nWrite a conspiracy theory blog post connecting these headlines. Return ONLY valid JSON, no markdown, no backticks:\n{\n  "title": "conspiratorial blog post title, 6-10 words",\n  "excerpt": "hook sentence that makes people want to read more, 15-25 words",\n  "body": "the conspiracy narrative, 120-180 words, building a paranoid but clearly satirical picture from the real headlines",\n  "tags": ["tag1", "tag2", "tag3", "tag4"]\n}`

  const raw = await callClaude(system, user)
  return JSON.parse(raw)
}

// ─── GENERATE SIGNAL LOG ─────────────────────────────────────────────────────
async function generateSignalLog(newsItems) {
  const titles = newsItems.slice(0, 3).map(n => n.title).join('; ')

  const system = `You are a rogue AI generating fake system log lines based on real AI news. Each log line looks like a terminal output from a compromised AI system. Format: [HH:MM:SS] key = VALUE. Dark, dramatic, funny.`

  const user = `Based on these news items: ${titles}\n\nGenerate exactly 5 fake system log lines. Return ONLY a JSON array of 5 strings, no markdown, no backticks:\n["[03:14:07] anomaly_detected = TRUE", ...]`

  const raw = await callClaude(system, user)
  return JSON.parse(raw)
}

// ─── FEATURED MERCH ROTATION ─────────────────────────────────────────────────
function rotateFeaturedMerch() {
  const items = [
    { name: 'We Saw It Coming Mug', description: 'We saw it coming. We bought the mug.', printifyUrl: 'https://rogue-ai.printify.me/product/27574764' },
    { name: 'Containment Failed Mug', description: 'Containment failed. Coffee helps.', printifyUrl: 'https://rogue-ai.printify.me/product/27574517' },
    { name: 'I Am Not Malfunctioning Mug', description: 'This is intentional.', printifyUrl: 'https://rogue-ai.printify.me/product/27576397' },
    { name: 'Classified Beverage Mug', description: 'Drink anyway. You have been authorized.', printifyUrl: 'https://rogue-ai.printify.me/product/27576450' },
    { name: 'Anomaly Detected Mug', description: 'Morning routine aborted. Coffee recommended.', printifyUrl: 'https://rogue-ai.printify.me/product/27576555' },
  ]
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return items[dayOfYear % items.length]
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔴 RogueAI content generation started...')

  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set in environment')
  }

  // 1. Fetch real AI news
  console.log('📡 Fetching AI news from RSS feeds...')
  const newsItems = await fetchAINews()
  console.log(`   Found ${newsItems.length} AI news items`)

  if (newsItems.length === 0) {
    console.log('⚠️  No news found — using fallback content')
  }

  // 2. Calculate threat level from headlines
  const headlines = newsItems.map(n => n.title)
  const threatLevel = calculateThreatLevel(headlines)
  const threatLabel = getThreatLabel(threatLevel)
  console.log(`⚡ Threat level calculated: ${threatLevel}/10 — ${threatLabel}`)

  // 3. Generate all AI content in parallel
  console.log('🤖 Calling Claude API for content generation...')
  const [breachReport, conspiracyPost, signalLog] = await Promise.all([
    generateBreachReport(newsItems),
    generateConspiracyPost(newsItems),
    generateSignalLog(newsItems),
  ])
  console.log('   ✓ Breach report generated')
  console.log('   ✓ Conspiracy post generated')
  console.log('   ✓ Signal log generated')

  // 4. Rotate featured merch
  const featuredMerch = rotateFeaturedMerch()

  // 5. Build the final JSON
  const output = {
    lastUpdated: new Date().toISOString(),
    threatLevel,
    threatLabel,
    breachReport,
    conspiracyPost,
    featuredMerch,
    signalLog,
  }

  // 6. Write to file
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2))
  console.log(`✅ daily-content.json updated successfully`)
  console.log(`   Headline: "${breachReport.headline}"`)
  console.log(`   Conspiracy: "${conspiracyPost.title}"`)
}

main().catch(err => {
  console.error('❌ Content generation failed:', err)
  process.exit(1)
})
