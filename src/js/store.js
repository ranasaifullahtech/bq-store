// src/js/store.js

const makeId = () => (crypto.randomUUID?.() ?? 'id_' + Math.random().toString(36).slice(2))

let products = []
let categories = []

export const Products = {
  list: async () => [...products],
  create: async (input) => {
    const p = { id: makeId(), createdAt: Date.now(), ...input }
    products = [p, ...products]
    return p
  },
  update: async (id, patch) => {
    products = products.map(p => p.id === id ? { ...p, ...patch } : p)
    return products.find(p => p.id === id)
  },
  remove: async (id) => {
    products = products.filter(p => p.id !== id)
  }
}

export const Categories = {
  list: async () => [...categories],
  create: async (input) => {
    const c = { id: makeId(), createdAt: Date.now(), ...input }
    categories = [c, ...categories]
    return c
  },
  update: async (id, patch) => {
    categories = categories.map(c => c.id === id ? { ...c, ...patch } : c)
    return categories.find(c => c.id === id)
  },
  remove: async (id) => {
    const usedBy = products.filter(p => p.categoryId === id)
    if (usedBy.length > 0) {
      const err = new Error(`Cannot delete: ${usedBy.length} product(s) use this category.`)
      err.code = 'category-in-use'
      throw err
    }
    categories = categories.filter(c => c.id !== id)
  }
}