import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import LinkDetail from './pages/LinkDetail'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">🔗 LinkPulse</Link>
        </div>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/link/:code" element={<LinkDetail />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
