const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function fetchJson(url, options = {}) {
  const res = await fetch(`${API_URL}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Fehler' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  getLinks: () => fetchJson('/links/?limit=100'),
  createLink: (url) => fetchJson('/links/', { method: 'POST', body: JSON.stringify({ original_url: url }) }),
  deleteLink: (id) => fetchJson(`/links/${id}`, { method: 'DELETE' }),
  getStats: (code) => fetchJson(`/${code}/stats`),
}
