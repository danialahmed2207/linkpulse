import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Home from './pages/Home'
import LinkDetail from './pages/LinkDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '4rem' }}>Lade...</p>
  return user ? children : <Navigate to="/login" />
}

function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">🔗 LinkPulse</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>👤 {user.username}</span>
              <button onClick={logout} className="btn btn-secondary btn-small">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-small">Login</Link>
              <Link to="/register" className="btn btn-primary btn-small">Registrieren</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/link/:code" element={<PrivateRoute><LinkDetail /></PrivateRoute>} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="main">
          <AppRoutes />
        </main>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
