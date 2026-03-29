import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()

const FILES = [
  {
    relPath: 'content/review-queue.json',
    requiredKeys: ['week_of', 'generated_at', 'candidates'],
  },
  {
    relPath: 'content/publish-queue.json',
    requiredKeys: ['week_of', 'approved_ids'],
  },
  {
    relPath: 'content/merch-catalog.json',
    requiredKeys: ['generated_at', 'items'],
  },
  {
    relPath: 'content/product-config.json',
    requiredKeys: ['brand_name', 'product_types'],
  },
]

function logInfo(message) {
  console.log(`[merch-validate] ${message}`)
}

function logError(message) {
  console.error(`[merch-validate] ERROR: ${message}`)
}

function readJsonFile(absPath, relPath) {
  try {
    // Read the file as plain text first so JSON parse errors are easy to isolate.
    const raw = fs.readFileSync(absPath, 'utf8')

    // Reject blank files early because an empty file is not valid JSON.
    if (!raw.trim()) {
      throw new Error(`${relPath} is empty`)
    }

    // Parse the JSON content into a normal JavaScript object.
    return JSON.parse(raw)
  } catch (error) {
    // Bubble the real reason up so the script fails loudly and clearly.
    throw new Error(`${relPath} could not be read as valid JSON: ${error.message}`)
  }
}

function validateRequiredKeys(data, relPath, requiredKeys) {
  for (const key of requiredKeys) {
    if (!(key in data)) {
      throw new Error(`${relPath} is missing required key: ${key}`)
    }
  }
}

function validateArray(value, relPath, keyName) {
  if (!Array.isArray(value)) {
    throw new Error(`${relPath} key "${keyName}" must be an array`)
  }
}

function validateString(value, relPath, keyName) {
  if (typeof value !== 'string') {
    throw new Error(`${relPath} key "${keyName}" must be a string`)
  }
}

function validateReviewQueue(data, relPath) {
  validateString(data.week_of, relPath, 'week_of')
  validateString(data.generated_at, relPath, 'generated_at')
  validateArray(data.candidates, relPath, 'candidates')
}

function validatePublishQueue(data, relPath) {
  validateString(data.week_of, relPath, 'week_of')
  validateArray(data.approved_ids, relPath, 'approved_ids')
}

function validateMerchCatalog(data, relPath) {
  validateString(data.generated_at, relPath, 'generated_at')
  validateArray(data.items, relPath, 'items')
}

function validateProductConfig(data, relPath) {
  validateString(data.brand_name, relPath, 'brand_name')
  validateArray(data.product_types, relPath, 'product_types')

  // Keep the blueprint strict so future stores stay simple and repeatable.
  if (data.product_types.length !== 10) {
    throw new Error(`${relPath} must contain exactly 10 product_types`)
  }

  const allowedBrandingModes = new Set(['logo_plus_saying', 'saying_only'])
  const seenKeys = new Set()

  for (const item of data.product_types) {
    if (!item || typeof item !== 'object') {
      throw new Error(`${relPath} contains an invalid product_types entry`)
    }

    validateString(item.key, relPath, 'product_types[].key')
    validateString(item.label, relPath, 'product_types[].label')
    validateString(item.branding_mode, relPath, 'product_types[].branding_mode')

    if (typeof item.enabled !== 'boolean') {
      throw new Error(`${relPath} product_types[].enabled must be a boolean`)
    }

    if (!allowedBrandingModes.has(item.branding_mode)) {
      throw new Error(
        `${relPath} has invalid branding_mode "${item.branding_mode}" for key "${item.key}"`
      )
    }

    if (seenKeys.has(item.key)) {
      throw new Error(`${relPath} has duplicate product key "${item.key}"`)
    }

    seenKeys.add(item.key)
  }
}

function main() {
  try {
    for (const file of FILES) {
      const absPath = path.join(ROOT, file.relPath)

      // Fail immediately if a required pipeline file is missing.
      if (!fs.existsSync(absPath)) {
        throw new Error(`Missing required file: ${file.relPath}`)
      }

      const data = readJsonFile(absPath, file.relPath)
      validateRequiredKeys(data, file.relPath, file.requiredKeys)

      if (file.relPath.endsWith('review-queue.json')) {
        validateReviewQueue(data, file.relPath)
      } else if (file.relPath.endsWith('publish-queue.json')) {
        validatePublishQueue(data, file.relPath)
      } else if (file.relPath.endsWith('merch-catalog.json')) {
        validateMerchCatalog(data, file.relPath)
      } else if (file.relPath.endsWith('product-config.json')) {
        validateProductConfig(data, file.relPath)
      }

      logInfo(`Validated ${file.relPath}`)
    }

    logInfo('Merch pipeline schema looks good.')
  } catch (error) {
    logError(error.message)
    process.exit(1)
  }
}

main()