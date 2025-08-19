import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-chess-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">♔</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Chess Insights</h1>
          </Link>
          
          <nav className="flex space-x-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-chess-primary transition-colors duration-200"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header