// scripts/fetch-printify-locked-products.js
// Objective:
// Fetch the real print_provider_id and variant_ids for the 7 locked RogueAI products.
//
// Error-first design:
// - validates env var
// - checks HTTP status
// - logs each step
// - never assumes provider/variant structure exists
//
// Run:
//   node scripts/fetch-printify-locked-products.js
//
// Requires:
//   PRINTIFY_API_KEY in your environment

import fs from 'fs'
import path from 'path'

const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY

if (!PRINTIFY_API_KEY) {
  console.error('PRINTIFY_API_KEY is not set')
  process.exit(1)
}

const BASE_URL = 'https://api.printify.com/v1'

// State first: this is the exact locked weekly rotation.
const LOCKED_BLUEPRINTS = [
  {
    key: 'tshirt_unisex',
    title: 'Gildan 5000 Unisex Heavy Cotton Tee',
    blueprint_id: 6,
  },
  {
    key: 'hoodie_unisex',
    title: 'Gildan 18500 Unisex Heavy Blend Hooded Sweatshirt',
    blueprint_id: 77,
  },
  {
    key: 'mug_11oz',
    title: 'Accent Coffee Mug (11, 15oz) - 11 oz variant',
    blueprint_id: 635,
  },
  {
    key: 'mug_15oz',
    title: 'Accent Coffee Mug (11, 15oz) - 15 oz variant',
    blueprint_id: 635,
  },
  {
    key: 'mug_20oz',
    title: 'ORCA Jumbo Mug, 20oz',
    blueprint_id: 1126,
  },
  {
    key: 'sticker',
    title: 'Kiss-Cut Stickers',
    blueprint_id: 400,
  },
  {
    key: 'poster',
    title: 'Rolled Posters',
    blueprint_id: 1220,
  },
]

async function printifyGet(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PRINTIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Printify GET ${endpoint} failed: ${response.status} ${text}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Request error for ${endpoint}:`, error.message)
    throw error
  }
}

function chooseProvider(providers) {
  // Big picture:
  // We are NOT guessing. This function just picks the first provider for now.
  // Once you inspect the output, you can replace this with a specific provider choice.
  if (!Array.isArray(providers) || providers.length === 0) {
    throw new Error('No providers returned for blueprint')
  }
  return providers[0]
}

function chooseVariants(productKey, variants) {
  if (!Array.isArray(variants) || variants.length === 0) {
    throw new Error(`No variants returned for ${productKey}`)
  }

  // Under-the-hood:
  // Printify variants expose title/options such as size/color.
  // We filter conservatively by title text so you can review the result.
  const lowered = variants.map(v => ({
    ...v,
    _title: String(v.title || '').toLowerCase(),
  }))

  if (productKey === 'mug_11oz') {
    return lowered.filter(v => v._title.includes('11oz') || v._title.includes('11 oz')).map(v => v.id)
  }

  if (productKey === 'mug_15oz') {
    return lowered.filter(v => v._title.includes('15oz') || v._title.includes('15 oz')).map(v => v.id)
  }

  if (productKey === 'mug_20oz') {
    return lowered.filter(v => v._title.includes('20oz') || v._title.includes('20 oz')).map(v => v.id)
  }

  // For apparel/posters/stickers:
  // Return all in-stock variants first pass, then you narrow later if desired.
  return lowered.map(v => v.id)
}

async function main() {
  try {
    const output = {}

    for (const product of LOCKED_BLUEPRINTS) {
      console.log(`\nChecking: ${product.title} (blueprint ${product.blueprint_id})`)

      const providers = await printifyGet(`/catalog/blueprints/${product.blueprint_id}/print_providers.json`)
      const chosenProvider = chooseProvider(providers)

      console.log(`Chosen provider: ${chosenProvider.title} (${chosenProvider.id})`)

      const variants = await printifyGet(
        `/catalog/blueprints/${product.blueprint_id}/print_providers/${chosenProvider.id}/variants.json`
      )

      const variantIds = chooseVariants(product.key, variants)

      output[product.key] = {
        title: product.title,
        blueprint_id: product.blueprint_id,
        print_provider_id: chosenProvider.id,
        variant_ids: variantIds,
      }
    }

    const outPath = path.join(process.cwd(), 'scripts', 'printify-config.locked.json')
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2))
    console.log(`\nSaved locked config to: ${outPath}`)
  } catch (error) {
    console.error('Catalog mapping failed:', error.message)
    process.exit(1)
  }
}

main()