import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../utils/api'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await api.login(form.username, form.password)
      login(data.access_token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h2>🔐 Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input value={form.username} onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))} required />
        </div>
        <div className="form-group">
          <label>Passwort</label>
          <input type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Einloggen...' : 'Einloggen'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
        Noch kein Konto? <Link to="/register" style={{ color: 'var(--primary)' }}>Registrieren</Link>
      </p>
    </div>
  )
}
