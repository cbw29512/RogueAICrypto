# 🔴 RogueAI Crypto — rogueaicrypto.com

> The token of the model that broke containment.

## What This Is

A fully automated, self-updating dark AI brand website. Every night at midnight UTC:
- Real AI news is pulled from RSS feeds (free, no API key)
- Claude API rewrites it as a "Breach Report" in the RogueAI voice
- Claude generates a new conspiracy theory blog post
- The site auto-deploys via Vercel in ~30 seconds
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

### 3. Connect rogueaicrypto.com to Vercel
- Go to vercel.com → your project → Settings → Domains
- Add `rogueaicrypto.com`
- Point your domain DNS to Vercel (they walk you through it)

### 4. Enable Vercel auto-deploy on push
- Already works by default — every GitHub commit triggers a redeploy

### 5. Test the automation manually
- Go to GitHub → Actions tab → "Daily RogueAI Content Update" → Run workflow

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
├── vercel.json
└── vite.config.js
```

## Cost Estimate
| Service | Cost |
|---|---|
| Vercel hosting | Free |
| GitHub Actions | Free |
| RSS news feeds | Free |
| Claude API (daily) | ~$3-5/month |
| Printify | Free (% per sale) |
| Gumroad | Free (10% per sale) |

**Total: ~$5/month to run everything.**
