// src/js/ui.js

export const $ = (selector, parent = document) => parent.querySelector(selector)
export const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector))

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag)
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'class') node.className = value
      else if (key === 'dataset') Object.assign(node.dataset, value)
      else if (key.startsWith('on') && typeof value === 'function') {
        node.addEventListener(key.slice(2).toLowerCase(), value)
      } else if (value === true) node.setAttribute(key, '')
      else if (value === false || value == null) { /* skip */ }
      else node.setAttribute(key, value)
    }
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue
    node.append(child instanceof Node ? child : document.createTextNode(String(child)))
  }
  return node
}

export function on(target, event, handler, options) {
  target.addEventListener(event, handler, options)
  return () => target.removeEventListener(event, handler, options)
}

const toastRegion = () => $('#toast-region')

export function showToast({ type = 'neutral', message, timeout = 3000 }) {
  const region = toastRegion()
  if (!region) return
  const toast = el('div', {
    class: [
      'rounded-md px-4 py-2 text-sm shadow-card pointer-events-auto',
      type === 'success' && 'bg-success-soft text-success',
      type === 'danger' && 'bg-danger-soft text-danger',
      type === 'neutral' && 'bg-white text-text-primary border border-border'
    ].filter(Boolean).join(' ')
  }, message)

  region.append(toast)
  setTimeout(() => toast.remove(), timeout)
}

export const formatPrice = (paisa) => `Rs. ${(paisa / 100).toLocaleString('en-IN', {
  minimumFractionDigits: 2, maximumFractionDigits: 2
})}`

export const toSlug = (str) => String(str)
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

export const setText = (node, text) => { node.textContent = text ?? '' }

export const bus = {
  emit(name, detail) { window.dispatchEvent(new CustomEvent(`bq:${name}`, { detail })) },
  on(name, handler) {
    const fn = (e) => handler(e.detail)
    window.addEventListener(`bq:${name}`, fn)
    return () => window.removeEventListener(`bq:${name}`, fn)
  }
}

export function confirm(message) {
  return new Promise((resolve) => {
    const confirmed = window.confirm(message)
    resolve(confirmed)
  })
}