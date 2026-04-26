// src/js/categories.js
import { $, el, on, showToast, bus } from './ui.js'
import { Categories, Products } from './store.js'
import { openModal } from './modal.js'
import { categoryForm } from './category-form.js'

const tbody = () => $('#categories-list')
let allCategories = []
let productsByCat = new Map()
let listenersAttached = false
let frozen = false

export async function mountCategories() {
  allCategories = await Categories.list()
  productsByCat = await countProductsPerCategory()

  if (!listenersAttached) {
    on($('#add-category-btn'), 'click', () => openForm())

    on(tbody(), 'click', (e) => {
      const btn = e.target.closest('[data-action]')
      if (!btn) return
      const id = btn.dataset.id
      if (btn.dataset.action === 'edit') openForm(id)
      if (btn.dataset.action === 'delete') confirmDelete(id)
    })

    listenersAttached = true
  }

  render()
}

async function countProductsPerCategory() {
  const products = await Products.list()
  const map = new Map()
  for (const p of products) {
    if (!p.categoryId) continue
    map.set(p.categoryId, (map.get(p.categoryId) ?? 0) + 1)
  }
  return map
}

function render() {
  if (frozen) return
  const target = tbody()
  target.innerHTML = ''
  if (allCategories.length === 0) {
    target.append(el('tr', {},
      el('td', { colspan: 4, class: 'px-4 py-8 text-center text-sm text-text-muted' },
        'No categories yet. Click "Add category" to create one.')))
    return
  }
  for (const c of allCategories) target.append(row(c))
}

function row(c) {
  const count = productsByCat.get(c.id) ?? 0
  return el('tr', { class: 'border-b border-border last:border-0 hover:bg-surface/40' },
    el('td', { class: 'px-4 py-3 font-medium' }, c.name),
    el('td', { class: 'px-4 py-3 text-text-muted' }, c.slug),
    el('td', { class: 'px-4 py-3 text-text-muted' }, String(count)),
    el('td', { class: 'px-4 py-3' },
      el('div', { class: 'flex gap-1' },
        el('button', { type: 'button', class: 'px-2 py-1 text-xs rounded-sm hover:bg-surface', dataset: { action: 'edit', id: c.id } }, 'Edit'),
        el('button', { type: 'button', class: 'px-2 py-1 text-xs text-danger rounded-sm hover:bg-danger-soft', dataset: { action: 'delete', id: c.id } }, 'Delete')
      )
    )
  )
}

function freezeRenders() { frozen = true }
function unfreezeRenders() { frozen = false; render() }

async function openForm(id) {
  const existing = id ? allCategories.find(c => c.id === id) : undefined
  let modal
  const form = await categoryForm({
    initial: existing ?? {},
    onSubmit: async (data) => {
      if (data == null) { modal?.close(); return }
      try {
        if (existing) await Categories.update(existing.id, data)
        else await Categories.create(data)
        allCategories = await Categories.list()
        productsByCat = await countProductsPerCategory()
        render()
        bus.emit('categories-changed')
        modal?.close()
        showToast({ type: 'success', message: existing ? 'Category updated.' : 'Category added.' })
      } catch (err) {
        showToast({ type: 'danger', message: err.message })
      }
    }
  })
  modal = openModal({
    title: existing ? 'Edit category' : 'Add category',
    content: form,
    onOpen: freezeRenders,
    onClose: unfreezeRenders
  })
}

async function confirmDelete(id) {
  const c = allCategories.find(c => c.id === id)
  if (!c) return
  const count = productsByCat.get(id) ?? 0
  if (count > 0) {
    showToast({ type: 'danger', message: `Cannot delete "${c.name}" — ${count} product(s) depend on it.` })
    return
  }
  if (!window.confirm(`Delete "${c.name}"? This cannot be undone.`)) return
  try {
    await Categories.remove(id)
    allCategories = await Categories.list()
    productsByCat = await countProductsPerCategory()
    render()
    showToast({ type: 'success', message: 'Category deleted.' })
  } catch (err) {
    showToast({ type: 'danger', message: err.message })
  }
}