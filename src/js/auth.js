// src/js/auth.js
import { auth } from './config.js'
import { signInWithEmailAndPassword, onAuthStateChanged, signOut }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js'

export async function login(email, password) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return { user: credential.user }
  } catch (error) {
    throw mapAuthError(error)
  }
}

export async function logout() {
  await signOut(auth)
}

export function onAuthChanged(callback) {
  return onAuthStateChanged(auth, callback)
}

function mapAuthError(error) {
  const map = {
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.'
  }
  const msg = map[error.code] ?? 'Sign-in failed. Try again.'
  const e = new Error(msg)
  e.code = error.code
  return e
}