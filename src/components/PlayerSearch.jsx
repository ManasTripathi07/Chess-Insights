import React, { useState } from 'react'

function PlayerSearch({ onSearch, loading }) {
  const [username, setUsername] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username.trim()) {
      onSearch(username.trim())
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white p-8 mb-6 rounded-3xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        🔍 Search Lichess Player
      </h2>

      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        {/* Input Field */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Type a username..."
          className="flex-1 w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                     transition-all duration-200 text-gray-700 placeholder-gray-400
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={loading}
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="px-6 py-3 w-full sm:w-auto bg-green-600 text-white font-semibold rounded-xl 
                     shadow-md hover:bg-green-700 hover:shadow-lg active:scale-95 
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  )
}

export default PlayerSearch
