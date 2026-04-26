// src/js/modal.js
import { $, on, el } from './ui.js'

let activeModal = null
let previousFocus = null

export function openModal({ title, content, onClose, onOpen }) {
  closeModal()
  previousFocus = document.activeElement

  const backdrop = el('div', {
    class: 'fixed inset-0 bg-black/40 z-50 grid place-items-center p-4',
    role: 'presentation'
  })
  const dialog = el('div', {
    role: 'dialog', 'aria-modal': true, 'aria-labelledby': 'modal-title',
    class: 'bg-white rounded-md max-w-lg w-full shadow-card max-h-[90vh] overflow-auto'
  })
  const header = el('header', { class: 'flex items-center justify-between px-5 py-4 border-b border-border' },
    el('h2', { id: 'modal-title', class: 'text-base font-semibold' }, title),
    el('button', { type: 'button', 'aria-label': 'Close',
      class: 'size-8 grid place-items-center rounded-md hover:bg-surface' }, '✕')
  )
  const body = el('div', { class: 'p-5' })
  body.append(content)
  dialog.append(header, body)
  backdrop.append(dialog)
  $('#modal-root').append(backdrop)

  onOpen?.()

  const focusable = dialog.querySelector('input, textarea, select, button, [tabindex]:not([tabindex="-1"])')
  focusable?.focus()

  const close = () => {
    backdrop.remove()
    activeModal = null
    previousFocus?.focus()
    onClose?.()
  }
  header.querySelector('button').addEventListener('click', close)
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close() })
  on(document, 'keydown', (e) => { if (e.key === 'Escape') close() }, { once: true })

  on(dialog, 'keydown', (e) => {
    if (e.key !== 'Tab') return
    const f = Array.from(dialog.querySelectorAll('input, textarea, select, button, [tabindex]:not([tabindex="-1"])'))
      .filter(n => !n.disabled && n.offsetParent !== null)
    if (!f.length) return
    const first = f[0], last = f[f.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  })

  activeModal = { close }
  return { close }
}

export function closeModal() {
  activeModal?.close()
}