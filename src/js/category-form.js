// src/js/category-form.js
import { el } from './ui.js'
import { Categories } from './store.js'

export async function categoryForm({ initial = {}, onSubmit }) {
  const form = el('form', { class: 'space-y-4', novalidate: true })
  const existing = await Categories.list()

  const nameInput = el('input', { id: 'c-name', name: 'name', required: true, class: 'w-full rounded-sm border border-border bg-white px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition', value: initial.name ?? '' })
  const slugInput = el('input', { id: 'c-slug', name: 'slug', required: true, class: 'w-full rounded-sm border border-border bg-white px-3.5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition', value: initial.slug ?? '' })

  let slugTouched = !!initial.slug
  nameInput.addEventListener('input', () => {
    if (!slugTouched) slugInput.value = toSlug(nameInput.value)
  })
  slugInput.addEventListener('input', () => { slugTouched = true })

  const field = (label, input, errorId) => el('div', {},
    el('label', { for: input.id, class: 'block text-xs font-medium uppercase tracking-wide text-text-muted mb-1.5' }, label),
    input,
    el('p', { id: errorId, class: 'mt-1.5 text-xs text-danger', hidden: true })
  )

  form.append(
    field('Name', nameInput, 'e-c-name'),
    field('Slug', slugInput, 'e-c-slug'),
    el('div', { class: 'flex justify-end gap-2 pt-2' },
      el('button', { type: 'button', class: 'inline-flex items-center justify-center gap-2 rounded-md bg-white border border-border px-5 py-2.5 text-sm font-medium hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition', dataset: { action: 'cancel' } }, 'Cancel'),
      el('button', { type: 'submit', class: 'inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition' }, initial.id ? 'Save changes' : 'Add category')
    )
  )

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const fd = new FormData(form)
    const data = {
      name: String(fd.get('name') ?? '').trim(),
      slug: String(fd.get('slug') ?? '').trim()
    }
    const errors = validate(data, existing, initial.id)
    paintErrors(form, errors)
    if (Object.keys(errors).length) return
    await onSubmit(data)
  })

  form.addEventListener('click', (e) => {
    if (e.target.dataset.action === 'cancel') onSubmit(null)
  })

  return form
}

function validate(data, existing, selfId) {
  const errors = {}
  if (!data.name) errors.name = 'Name is required.'
  if (!data.slug) errors.slug = 'Slug is required.'
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    errors.slug = 'Slug may only contain lowercase letters, numbers, and hyphens.'
  } else if (existing.some(c => c.id !== selfId && c.slug === data.slug)) {
    errors.slug = 'A category with this slug already exists.'
  }
  if (data.name && existing.some(c => c.id !== selfId && c.name.toLowerCase() === data.name.toLowerCase())) {
    errors.name = 'A category with this name already exists.'
  }
  return errors
}

function paintErrors(form, errors) {
  const map = { name: 'e-c-name', slug: 'e-c-slug' }
  for (const [key, id] of Object.entries(map)) {
    const err = form.querySelector('#' + id)
    if (errors[key]) { err.textContent = errors[key]; err.hidden = false }
    else { err.textContent = ''; err.hidden = true }
  }
  const first = Object.keys(errors)[0]
  if (first) form.querySelector(`[name="${first}"]`)?.focus()
}

function toSlug(s) {
  return String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}