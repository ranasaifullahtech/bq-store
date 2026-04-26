// src/js/product-form.js
import { el } from './ui.js'
import { Categories } from './store.js'

export async function productForm({ initial = {}, onSubmit }) {
  const cats = await Categories.list()
  const form = el('form', { class: 'space-y-4', novalidate: true })

  const field = (labelText, input, errorId) => el('div', {},
    el('label', { for: input.id, class: 'block text-xs font-medium uppercase tracking-wide text-text-muted mb-1.5' }, labelText),
    input,
    el('p', { id: errorId, class: 'mt-1.5 text-xs text-danger', hidden: true })
  )

  const nameInput = el('input', { id: 'f-name', name: 'name', required: true,
    class: 'w-full rounded-sm border border-border bg-white px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition', value: initial.name ?? '' })
  const descInput = el('textarea', { id: 'f-desc', name: 'description', rows: 3,
    class: 'w-full rounded-sm border border-border bg-white px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition', }, initial.description ?? '')
  const priceInput = el('input', { id: 'f-price', name: 'price', type: 'number', min: '0', step: '1', required: true,
    class: 'w-full rounded-sm border border-border bg-white px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition', value: initial.price != null ? String(initial.price) : '' })
  const imageInput = el('input', { id: 'f-image', name: 'imageUrl', type: 'url',
    class: 'w-full rounded-sm border border-border bg-white px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition', value: initial.imageUrl ?? '', placeholder: 'https://…' })
  const stockInput = el('input', { id: 'f-stock', name: 'stock', type: 'number', min: '0', step: '1', required: true,
    class: 'w-full rounded-sm border border-border bg-white px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition', value: initial.stock != null ? String(initial.stock) : '0' })

  const catSelect = el('select', { id: 'f-cat', name: 'categoryId', class: 'w-full rounded-sm border border-border bg-white px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition' },
    el('option', { value: '' }, '— Uncategorized —'),
    ...cats.map(c => el('option', { value: c.id, selected: c.id === initial.categoryId }, c.name))
  )

  form.append(
    field('Name', nameInput, 'e-name'),
    field('Description', descInput, 'e-desc'),
    el('div', { class: 'grid grid-cols-2 gap-4' },
      field('Price (paisa)', priceInput, 'e-price'),
      field('Stock', stockInput, 'e-stock')
    ),
    field('Image URL', imageInput, 'e-image'),
    field('Category', catSelect, 'e-cat'),
    el('div', { class: 'flex justify-end gap-2 pt-2' },
      el('button', { type: 'button', class: 'inline-flex items-center justify-center gap-2 rounded-md bg-white border border-border px-5 py-2.5 text-sm font-medium hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition', dataset: { action: 'cancel' } }, 'Cancel'),
      el('button', { type: 'submit', class: 'inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition' }, initial.id ? 'Save changes' : 'Add product')
    )
  )

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const fd = new FormData(form)
    const data = {
      name: String(fd.get('name') ?? '').trim(),
      description: String(fd.get('description') ?? '').trim(),
      price: Number(fd.get('price')),
      stock: Number(fd.get('stock')),
      imageUrl: String(fd.get('imageUrl') ?? '').trim(),
      categoryId: String(fd.get('categoryId') ?? '') || null
    }
    const errors = validate(data)
    paintErrors(form, errors)
    if (Object.keys(errors).length) return

    await onSubmit(data)
  })

  form.addEventListener('click', (e) => {
    if (e.target.dataset.action === 'cancel') onSubmit(null)
  })

  return form
}

function validate(data) {
  const errors = {}
  if (!data.name) errors.name = 'Name is required.'
  if (!Number.isInteger(data.price) || data.price < 0) errors.price = 'Price must be a non-negative integer.'
  if (!Number.isInteger(data.stock) || data.stock < 0) errors.stock = 'Stock must be a non-negative integer.'
  if (data.imageUrl && !/^https?:\/\//.test(data.imageUrl)) errors.imageUrl = 'Image URL must start with http(s).'
  return errors
}

function paintErrors(form, errors) {
  const map = { name: 'e-name', price: 'e-price', stock: 'e-stock', imageUrl: 'e-image' }
  for (const [key, id] of Object.entries(map)) {
    const el = form.querySelector('#' + id)
    if (!el) continue
    if (errors[key]) { el.textContent = errors[key]; el.hidden = false }
    else { el.textContent = ''; el.hidden = true }
  }
  const firstErrorKey = Object.keys(errors)[0]
  if (firstErrorKey) form.querySelector(`[name="${firstErrorKey}"]`)?.focus()
}