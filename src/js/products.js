// src/js/products.js
import { $, $$, el, on, showToast, formatPrice, bus } from './ui.js'
import { Products, Categories } from './store.js'
import { openModal } from './modal.js'
import { productForm } from './product-form.js'

const listEl = () => $('#products-list')
const searchEl = () => $('#products-search')

let allProducts = []
let allCategories = []
let query = ''
let listenersAttached = false
let frozen = false

export async function mountProducts() {
  allProducts = await Products.list()
  allCategories = await Categories.list()

  if (!listenersAttached) {
    attachListeners()
    listenersAttached = true
  }

  bus.on('categories-changed', async () => {
    allCategories = await Categories.list()
    render()
  })

  render()
}

function attachListeners() {
  on($('#add-product-btn'), 'click', () => openForm())

  on(searchEl(), 'input', (e) => {
    query = e.target.value.trim().toLowerCase()
    render()
  })

  on(listEl(), 'click', async (e) => {
    const btn = e.target.closest('[data-action]')
    if (!btn) return
    const id = btn.dataset.id
    if (btn.dataset.action === 'edit') openForm(id)
    if (btn.dataset.action === 'delete') confirmDelete(id)
  })
}

function render() {
  if (frozen) return
  const target = listEl()
  target.innerHTML = ''
  const filtered = query
    ? allProducts.filter(p => p.name.toLowerCase().includes(query))
    : allProducts

  if (filtered.length === 0) {
    target.append(el('p', {
      class: 'col-span-full py-12 text-center text-sm text-text-muted'
    }, query ? `No products match "${query}".` : 'No products yet. Click "Add product" to create one.'))
    return
  }

  for (const p of filtered) target.append(card(p))
}

function card(p) {
  const catName = allCategories.find(c => c.id === p.categoryId)?.name ?? 'Uncategorized'
  return el('article', {
    class: 'bg-white rounded-md border border-border overflow-hidden',
    role: 'listitem', dataset: { id: p.id }
  },
    el('div', { class: 'aspect-square bg-surface' },
      el('img', {
        src: p.imageUrl || '/src/assets/images/placeholder.svg',
        alt: '', loading: 'lazy', class: 'w-full h-full object-cover'
      })
    ),
    el('div', { class: 'p-4 space-y-1' },
      el('h3', { class: 'text-sm font-medium truncate' }, p.name),
      el('p', { class: 'text-xs text-text-muted' }, catName),
      el('p', { class: 'text-sm font-semibold' }, formatPrice(p.price))
    ),
    el('div', { class: 'border-t border-border flex divide-x divide-border' },
      el('button', { type: 'button', class: 'flex-1 py-2 text-xs text-text-muted hover:bg-surface hover:text-text-primary', dataset: { action: 'edit', id: p.id } }, 'Edit'),
      el('button', { type: 'button', class: 'flex-1 py-2 text-xs text-danger hover:bg-danger-soft', dataset: { action: 'delete', id: p.id } }, 'Delete')
    )
  )
}

function freezeRenders() { frozen = true }
function unfreezeRenders() { frozen = false; render() }

async function openForm(id) {
  const existing = id ? allProducts.find(p => p.id === id) : undefined
  let modal
  const form = await productForm({
    initial: existing ?? {},
    onSubmit: async (data) => {
      if (data == null) { modal?.close(); return }
      try {
        if (existing) await Products.update(existing.id, data)
        else await Products.create(data)
        allProducts = await Products.list()
        render()
        modal?.close()
        showToast({ type: 'success', message: existing ? 'Product updated.' : 'Product added.' })
      } catch (err) {
        showToast({ type: 'danger', message: err.message })
      }
    }
  })
  modal = openModal({
    title: existing ? 'Edit product' : 'Add product',
    content: form,
    onOpen: freezeRenders,
    onClose: unfreezeRenders
  })
}

async function confirmDelete(id) {
  const p = allProducts.find(p => p.id === id)
  if (!p) return
  if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return
  try {
    await Products.remove(id)
    allProducts = await Products.list()
    render()
    showToast({ type: 'success', message: 'Product deleted.' })
  } catch (err) {
    showToast({ type: 'danger', message: err.message })
  }
}