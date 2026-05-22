import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'

export default function Home() {
  const [url, setUrl] = useState('')
  const [links, setLinks] = useState([])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchLinks = async () => {
    try {
      const data = await api.getLinks()
      setLinks(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await api.createLink(url)
      setResult(data)
      setUrl('')
      fetchLinks()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Link wirklich löschen?')) return
    try {
      await api.deleteLink(id)
      fetchLinks()
    } catch (err) {
      setError(err.message)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div>
      <form className="url-form" onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="https://deine-lange-url.de/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Kürzen...' : 'Kürzen'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result-box">
          <h3>✅ Shortlink erstellt!</h3>
          <div className="result-url">
            <a href={result.short_url} target="_blank" rel="noreferrer">
              {result.short_url}
            </a>
            <button onClick={() => copyToClipboard(result.short_url)}>Kopieren</button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Original: {result.original_url}
          </p>
        </div>
      )}

      <h2 style={{ marginBottom: '1rem' }}>Deine Links ({links.length})</h2>

      {links.length === 0 ? (
        <div className="empty-state">
          <p>Noch keine Links. Erstelle deinen ersten Shortlink oben!</p>
        </div>
      ) : (
        <div className="link-list">
          {links.map((link) => (
            <div key={link.id} className="link-card">
              <div className="link-info">
                <h3>
                  <Link to={`/link/${link.short_code}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {link.short_url}
                  </Link>
                </h3>
                <p>{link.original_url}</p>
              </div>
              <div className="link-meta">
                <span className="click-badge">{link.clicks} Klicks</span>
                <button className="btn-delete" onClick={() => handleDelete(link.id)}>
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
