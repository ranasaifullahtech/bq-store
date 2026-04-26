// src/js/storage.js
const prefix = 'bq:'
const VERSION = 1

export function read(key, fallback = null) {
  try {
    const raw = localStorage.getItem(prefix + key)
    if (!raw) return fallback
    const entry = JSON.parse(raw)
    if (entry.v !== VERSION) return fallback
    return entry.d
  } catch {
    return fallback
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(prefix + key, JSON.stringify({ v: VERSION, d: value }))
  } catch {}
}

export function remove(key) {
  localStorage.removeItem(prefix + key)
}

export function clearAll() {
  for (const k of Object.keys(localStorage)) {
    if (k.startsWith(prefix)) localStorage.removeItem(k)
  }
}