// src/js/main.js
import { $, on, showToast } from './ui.js'

const form = $('#login-form')
const fieldset = form.querySelector('fieldset')
const emailEl = $('#email')
const passwordEl = $('#password')
const emailError = $('#email-error')
const passwordError = $('#password-error')
const alertBox = $('#login-alert')
const submitBtn = $('#submit-btn')
const submitLabel = $('#submit-label')
const status = $('#form-status')
const togglePw = $('#toggle-password')

let failedAttempts = 0
let lockedUntil = 0
let countdownTimer = null

const validators = {
  email: (v) => {
    if (!v.trim()) return 'Email is required.'
    if (!/^\S+@\S+\.\S+$/.test(v.trim())) return 'Enter a valid email.'
    return null
  },
  password: (v) => {
    if (!v) return 'Password is required.'
    if (v.length < 6) return 'Password must be at least 6 characters.'
    return null
  }
}

function setFieldError(errorEl, message) {
  if (message) {
    errorEl.textContent = message
    errorEl.hidden = false
    errorEl.parentElement.querySelector('input')?.setAttribute('aria-invalid', 'true')
  } else {
    errorEl.textContent = ''
    errorEl.hidden = true
    errorEl.parentElement.querySelector('input')?.removeAttribute('aria-invalid')
  }
}

function validateAll() {
  const emailMsg = validators.email(emailEl.value)
  const passwordMsg = validators.password(passwordEl.value)
  setFieldError(emailError, emailMsg)
  setFieldError(passwordError, passwordMsg)
  return !emailMsg && !passwordMsg
}

on(emailEl, 'input', () => { if (!emailError.hidden) setFieldError(emailError, validators.email(emailEl.value)) })
on(passwordEl, 'input', () => { if (!passwordError.hidden) setFieldError(passwordError, validators.password(passwordEl.value)) })

on(togglePw, 'click', () => {
  const isHidden = passwordEl.type === 'password'
  passwordEl.type = isHidden ? 'text' : 'password'
  togglePw.setAttribute('aria-pressed', String(isHidden))
  togglePw.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password')
})

function startCountdown() {
  clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    const remaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000))
    if (remaining === 0) {
      clearInterval(countdownTimer)
      fieldset.disabled = false
      submitBtn.disabled = false
      alertBox.hidden = true
      status.textContent = ''
    } else {
      status.textContent = `Locked. Try again in ${remaining}s.`
    }
  }, 500)
}

function enforceLockout() {
  if (Date.now() < lockedUntil) {
    fieldset.disabled = true
    submitBtn.disabled = true
    startCountdown()
    return true
  }
  return false
}

on(form, 'submit', async (event) => {
  event.preventDefault()
  alertBox.hidden = true

  if (enforceLockout()) return
  if (!validateAll()) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]')
    firstInvalid?.focus()
    return
  }

  const email = emailEl.value.trim()
  const password = passwordEl.value

  setLoading(true)
  try {
    await login(email, password)
    failedAttempts = 0
    showToast({ type: 'success', message: 'Welcome back.' })
    window.location.href = '/dashboard.html'
  } catch (err) {
    failedAttempts += 1
    passwordEl.value = ''
    alertBox.textContent = err.message
    alertBox.hidden = false
    passwordEl.focus()

    if (failedAttempts >= 5) {
      lockedUntil = Date.now() + 30_000
      enforceLockout()
    }
  } finally {
    setLoading(false)
  }
})

function setLoading(isLoading) {
  submitBtn.disabled = isLoading
  submitLabel.textContent = isLoading ? 'Signing in…' : 'Sign in'
}

async function login(email, password) {
  const mockUser = { email: 'admin@bqstore.com' }
  const mockPass = 'admin123'
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === mockUser.email && password === mockPass) {
        localStorage.setItem('bq-mock-user', JSON.stringify(mockUser))
        resolve(mockUser)
      } else {
        reject(new Error('Invalid email or password.'))
      }
    }, 600)
  })
}