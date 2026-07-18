// Browser-only Aksara Bali OCR via Tesseract.js + our custom `ban` model.
//
// The engine (WASM worker) loads from a CDN and is cached by the service worker;
// the language model is served locally from /tessdata/ban.traineddata, so once
// both are cached the reader works offline. Recognised Balinese Unicode is turned
// into Latin by utils/balineseToLatin.js (deterministic, no model needed).

import { convertBalineseToLatin } from './balineseToLatin'

// Keep in sync with the tesseract.js version in package.json.
const TESS_VERSION = '5.1.1'
const WORKER_PATH = `https://cdn.jsdelivr.net/npm/tesseract.js@${TESS_VERSION}/dist/worker.min.js`
const CORE_PATH = `https://cdn.jsdelivr.net/npm/tesseract.js-core@${TESS_VERSION}`
const MODEL_URL = '/tessdata/ban.traineddata'

let workerPromise = null

// Is the trained model actually deployed? The UI uses this to show setup
// instructions instead of a cryptic fetch error before ban.traineddata exists.
export async function isModelAvailable() {
  try {
    const res = await fetch(MODEL_URL, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

async function getWorker(onProgress) {
  if (workerPromise) return workerPromise
  workerPromise = (async () => {
    const { createWorker } = await import('tesseract.js')
    return createWorker('ban', 1, {
      langPath: '/tessdata',
      gzip: false, // ban.traineddata is shipped uncompressed
      workerPath: WORKER_PATH,
      corePath: CORE_PATH,
      logger: (m) => {
        if (onProgress && m.status === 'recognizing text') onProgress(m.progress)
      },
    })
  })().catch((err) => {
    workerPromise = null // allow retry after a failure
    throw err
  })
  return workerPromise
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    if (src instanceof HTMLImageElement && src.complete) return resolve(src)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src instanceof Blob ? URL.createObjectURL(src) : src
  })
}

// Upscale small images and convert to grayscale. Tesseract does its own
// binarisation, so we keep preprocessing light (aggressive thresholding tends to
// hurt on uneven phone-photo lighting). Returns a canvas.
async function preprocess(source, { minWidth = 1000, maxWidth = 2200 } = {}) {
  const img = await loadImage(source)
  const w = img.naturalWidth || img.width
  const h = img.naturalHeight || img.height
  let scale = 1
  if (w < minWidth) scale = minWidth / w
  else if (w > maxWidth) scale = maxWidth / w

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(w * scale)
  canvas.height = Math.round(h * scale)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const px = data.data
  for (let i = 0; i < px.length; i += 4) {
    const g = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]
    px[i] = px[i + 1] = px[i + 2] = g
  }
  ctx.putImageData(data, 0, 0)
  return canvas
}

/**
 * Recognise Balinese script in an image and transliterate it to Latin.
 * @param {File|Blob|string|HTMLImageElement} source - image to read
 * @param {{ onProgress?: (p:number)=>void }} [opts]
 * @returns {Promise<{ balinese: string, latin: string, confidence: number }>}
 */
export async function recognizeBalinese(source, { onProgress } = {}) {
  const worker = await getWorker(onProgress)
  const canvas = await preprocess(source)
  const { data } = await worker.recognize(canvas)
  const balinese = (data.text || '').trim()
  return {
    balinese,
    latin: convertBalineseToLatin(balinese),
    confidence: Math.round(data.confidence || 0),
  }
}

// Free the worker (e.g. when leaving the page).
export async function disposeOcr() {
  if (!workerPromise) return
  try {
    const worker = await workerPromise
    await worker.terminate()
  } catch {
    /* already gone */
  }
  workerPromise = null
}
