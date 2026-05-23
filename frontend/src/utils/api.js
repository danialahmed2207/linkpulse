const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function getToken() {
  return localStorage.getItem('token')
}

async function fetchJson(url, options = {}) {
  const token = getToken()
  const res = await fetch(`${API_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Fehler' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  login: (username, password) =>
    fetchJson('/auth/login', { method: 'POST', body: JSON.stringify({ username, email: `${username}@link.local`, password }) }),
  register: (username, email, password) =>
    fetchJson('/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) }),
  getLinks: () => fetchJson('/links/?limit=100'),
  createLink: (url) => fetchJson('/links/', { method: 'POST', body: JSON.stringify({ original_url: url }) }),
  deleteLink: (id) => fetchJson(`/links/${id}`, { method: 'DELETE' }),
  getStats: (code) => fetchJson(`/${code}/stats`),
}
