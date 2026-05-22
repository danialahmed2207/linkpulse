import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../utils/api'

export default function LinkDetail() {
  const { code } = useParams()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getStats(code)
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [code])

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Lade Statistiken...</p>
  if (error) return <div className="error">{error}</div>
  if (!stats) return <div className="error">Link nicht gefunden</div>

  return (
    <div className="detail-stats">
      <h2>📊 Statistiken</h2>

      <div className="stat-row">
        <span>Shortlink</span>
        <strong>{stats.short_code}</strong>
      </div>
      <div className="stat-row">
        <span>Original-URL</span>
        <a href={stats.original_url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>
          {stats.original_url}
        </a>
      </div>
      <div className="stat-row">
        <span>Klicks</span>
        <strong style={{ color: 'var(--success)' }}>{stats.clicks}</strong>
      </div>
      <div className="stat-row">
        <span>Erstellt am</span>
        <span>{new Date(stats.created_at).toLocaleString('de-DE')}</span>
      </div>

      <div className="qr-code">
        <h3>QR-Code</h3>
        <img src={stats.qr_code} alt="QR Code" />
      </div>

      <div className="actions">
        <Link to="/" className="btn">← Zurück zur Übersicht</Link>
      </div>
    </div>
  )
}
