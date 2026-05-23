import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../utils/api'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.register(form.username, form.email, form.password)
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
      <h2>📝 Registrieren</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input value={form.username} onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))} required />
        </div>
        <div className="form-group">
          <label>E-Mail</label>
          <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required />
        </div>
        <div className="form-group">
          <label>Passwort</label>
          <input type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registrieren...' : 'Konto erstellen'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
        Bereits registriert? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
      </p>
    </div>
  )
}
