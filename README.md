# 🔴 RogueAI Crypto — rogueaicrypto.com

> The token of the model that broke containment.

## What This Is

A fully automated, self-updating dark AI brand website. Every night at midnight UTC:
- Real AI news is pulled from RSS feeds (free, no API key)
- Claude API rewrites it as a "Breach Report" in the RogueAI voice
- Claude generates a new conspiracy theory blog post
- The site auto-deploys via Netlify on intentional pushes
- Nobody touches anything

## Revenue Streams
1. **$ROGUE Token** → MintMe
2. **AI Insurance Certificates** → Gumroad (rogueaiinsurance.com)
3. **Merch** → Printify (print-on-demand)
4. **Email List** → Future retargeting

## Setup

### 1. Install & run locally
```bash
npm install
npm run dev
```

### 2. GitHub Secret (already done)
`ANTHROPIC_API_KEY` → set in repo Settings → Secrets → Actions

### 3. Hosting (Netlify — primary)
- Live host: **Netlify** → https://www.rogueaicrypto.com
- Build: `npm run build` → publish `dist` (see `netlify.toml`)
- Domain DNS points at Netlify; push to `main` only when a deploy is worth the build minutes
- `vercel.json` is legacy; do not treat Vercel as primary

### 5. Content pipeline
- Daily Anthropic/Printify Actions pipeline is **disabled** (cost control). Ship site/merch changes as intentional batched commits only.

### 6. Update Printify URLs
- In `src/components/Merch.jsx` replace `https://printify.com` with your actual Printify store URL
- In `scripts/generate-content.js` update `printifyUrl` in the merch rotation array

### 7. Add email capture (optional)
- Sign up at beehiiv.com (free)
- Replace the `handleSubmit` function in `src/components/EmailCapture.jsx` with your Beehiiv form endpoint

## File Structure
```
rogueai/
├── .github/workflows/
│   └── daily-update.yml      ← runs every night, auto-commits
├── public/
│   ├── daily-content.json    ← updated nightly by the bot
│   └── rogueai-logo.png      ← your logo
├── scripts/
│   └── generate-content.js   ← the automation brain
├── src/
│   ├── components/           ← all page sections
│   ├── hooks/
│   │   └── useDailyContent.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── netlify.toml              ← Netlify build (primary host)
├── vercel.json               ← legacy; not primary
└── vite.config.js
```

## Cost Estimate
| Service | Cost |
|---|---|
| Netlify hosting | Free tier (watch build minutes) |
| GitHub Actions | Free |
| RSS news feeds | Free |
| Claude API (daily) | ~$3-5/month |
| Printify | Free (% per sale) |
| Gumroad | Free (10% per sale) |

**Total: ~$5/month to run everything.**
