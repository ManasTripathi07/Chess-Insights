import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import GameDetail from './pages/GameDetail'
import Header from './components/Header'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/game/:gameId" element={<GameDetail />} />
          </Routes>
        </main>
        <div className="text-center text-black text-l font-semibold">
        © 2025 Chess-Insights · Designed with ❤️ by{" "}
        <a
          href="https://www.linkedin.com/in/manas-tripathi-73876324b/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Manas Tripathi
        </a>
      </div>

      </div>
    </Router>
  )
}

export default App