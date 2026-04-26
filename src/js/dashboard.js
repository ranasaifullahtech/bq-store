// src/js/dashboard.js
import { $, $$, on, showToast } from './ui.js'

const mockUser = JSON.parse(localStorage.getItem('bq-mock-user') || 'null')
if (!mockUser) {
  window.location.replace('/index.html')
}

$('#user-email').textContent = mockUser?.email ?? ''

on($('#logout-btn'), 'click', () => {
  localStorage.removeItem('bq-mock-user')
  showToast({ type: 'neutral', message: 'Signed out.' })
  setTimeout(() => window.location.replace('/index.html'), 400)
})

const userMenuBtn = $('#user-menu-btn')
let userMenu = null

on(userMenuBtn, 'click', () => {
  const open = userMenuBtn.getAttribute('aria-expanded') === 'true'
  if (open) closeUserMenu()
  else openUserMenu()
})

function openUserMenu() {
  userMenuBtn.setAttribute('aria-expanded', 'true')
  userMenu = document.createElement('div')
  userMenu.setAttribute('role', 'menu')
  userMenu.className = 'absolute right-4 top-12 w-56 bg-white border border-border rounded-md shadow-card py-1 z-40'
  userMenu.innerHTML = `
    <button role="menuitem" class="w-full text-left px-3 py-2 text-sm hover:bg-surface" data-action="signout">
      Sign out
    </button>
  `
  document.body.append(userMenu)

  on(userMenu, 'click', (e) => {
    const btn = e.target.closest('[data-action="signout"]')
    if (btn) $('#logout-btn').click()
  })

  on(document, 'click', closeOnOutsideClick)
  on(document, 'keydown', closeOnEscape)
}

function closeUserMenu() {
  userMenuBtn.setAttribute('aria-expanded', 'false')
  userMenu?.remove()
  userMenu = null
  document.removeEventListener('click', closeOnOutsideClick)
  document.removeEventListener('keydown', closeOnEscape)
}

function closeOnOutsideClick(e) {
  if (!userMenu?.contains(e.target) && !userMenuBtn.contains(e.target)) closeUserMenu()
}

function closeOnEscape(e) {
  if (e.key === 'Escape') { closeUserMenu(); userMenuBtn.focus() }
}

const sidebar = $('#sidebar')
const toggle = $('#sidebar-toggle')

function setSidebar(open) {
  sidebar.classList.toggle('hidden', !open)
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
  if (open) sidebar.querySelector('a')?.focus()
}

on(toggle, 'click', () => setSidebar(sidebar.classList.contains('hidden')))

for (const link of $$('.nav-link')) {
  on(link, 'click', () => {
    if (window.matchMedia('(max-width: 1023px)').matches) setSidebar(false)
  })
}

on(document, 'keydown', (e) => {
  if (e.key === 'Escape' && !sidebar.classList.contains('hidden')) setSidebar(false)
})

const views = {
  products: $('#view-products'),
  categories: $('#view-categories')
}
const links = $$('.nav-link')

async function showView(name) {
  if (!views[name]) name = 'products'

  for (const key of Object.keys(views)) {
    views[key].hidden = key !== name
  }
  for (const link of links) {
    link.classList.toggle('is-active', link.dataset.view === name)
    link.setAttribute('aria-current', link.dataset.view === name ? 'page' : 'false')
  }

  document.title = `BQ Store — ${name[0].toUpperCase()}${name.slice(1)}`
  $('#main').focus()

  if (name === 'products' && !views.products.dataset.mounted) {
    const mod = await import('./products.js')
    mod.mountProducts()
    views.products.dataset.mounted = '1'
  }
  if (name === 'categories' && !views.categories.dataset.mounted) {
    const mod = await import('./categories.js')
    mod.mountCategories()
    views.categories.dataset.mounted = '1'
  }
}

function routeFromHash() {
  const name = (location.hash.replace('#/', '') || 'products').split('/')[0]
  showView(name)
}

for (const link of links) {
  on(link, 'click', (e) => {
    e.preventDefault()
    history.pushState(null, '', `#/${link.dataset.view}`)
    routeFromHash()
  })
}

on(window, 'hashchange', routeFromHash)
routeFromHash()

if (!localStorage.getItem('bq-seeded')) {
  const { Products, Categories } = await import('./store.js')
  const cat1 = await Categories.create({ name: 'Watches', slug: 'watches' })
  const cat2 = await Categories.create({ name: 'Straps', slug: 'straps' })
  await Products.create({ name: 'Chronos Elite', price: 249900, stock: 12, categoryId: cat1.id, imageUrl: '' })
  await Products.create({ name: 'Leather Band', price: 59900, stock: 40, categoryId: cat2.id, imageUrl: '' })
  localStorage.setItem('bq-seeded', '1')
}