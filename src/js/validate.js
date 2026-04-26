// src/js/validate.js

export const Rules = {
  required: (message = 'Required.') => ({ test: v => v != null && String(v).trim() !== '', message }),
  minLength: (n, message) => ({ test: v => String(v).length >= n, message: message ?? `Must be at least ${n} characters.` }),
  maxLength: (n, message) => ({ test: v => String(v).length <= n, message: message ?? `Must be at most ${n} characters.` }),
  email: (message = 'Enter a valid email.') => ({ test: v => /^\S+@\S+\.\S+$/.test(String(v).trim()), message }),
  url: (message = 'Must be a valid URL.') => ({ test: !v || /^https?:\/\/.+/.test(v), message }),
  slug: (message = 'Lowercase letters, numbers, hyphens only.') => ({
    test: v => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(v)), message
  }),
  min: (n, message) => ({ test: v => Number(v) >= n, message: message ?? `Must be ${n}.` }),
  max: (n, message) => ({ test: v => Number(v) <= n, message: message ?? `Must be ${n}.` }),
  integer: (message = 'Must be a whole number.') => ({ test: v => Number.isInteger(Number(v)), message }),
  custom: (fn, message) => ({ test: fn, message })
}

export function validate(data, schema, context = {}) {
  const errors = {}
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field]
    for (const rule of rules) {
      const ok = rule.test(value, data, context)
      if (!ok) { errors[field] = rule.message; break }
    }
  }
  return errors
}