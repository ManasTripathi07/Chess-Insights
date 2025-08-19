import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { formatGameDate, formatTimeControl, getPlayerResult, getOpponentInfo } from '../utils/chess'

function GamesList({ games, username, loading }) {
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterResult, setFilterResult] = useState('')
  const [filterTimeControl, setFilterTimeControl] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAndSortedGames = useMemo(() => {
    if (!games) return []

    let filtered = games.filter(game => {
      if (filterResult) {
        const result = getPlayerResult(game, username)
        if (result.toLowerCase() !== filterResult.toLowerCase()) return false
      }
      if (filterTimeControl) {
        const timeControl = formatTimeControl(game.clock)
        if (!timeControl.includes(filterTimeControl)) return false
      }
      if (searchTerm) {
        const opening = game.opening
        if (!opening) return false
        const searchLower = searchTerm.toLowerCase()
        return (
          opening.name.toLowerCase().includes(searchLower) ||
          opening.eco.toLowerCase().includes(searchLower)
        )
      }
      return true
    })

    filtered.sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case 'date':
          aValue = a.createdAt
          bValue = b.createdAt
          break
        case 'rating':
          const aOpponent = getOpponentInfo(a, username)
          const bOpponent = getOpponentInfo(b, username)
          aValue = aOpponent.rating
          bValue = bOpponent.rating
          break
        default:
          return 0
      }
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    })

    return filtered
  }, [games, username, sortBy, sortOrder, filterResult, filterTimeControl, searchTerm])

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-white-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!games || games.length === 0) {
    return (
      <div className="card p-6 text-center bg-white rounded-xl shadow-md">
        <p className="text-gray-500">No games found. Search for a player to see their games.</p>
      </div>
    )
  }

  return (
    <div className="card p-8 mb-8 shadow-lg bg-gradient-to-b from-white to-gray-50 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Recent Games ({games.length})
      </h2>

      {/* Filters */}
<div className="mb-6 flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow-md border border-gray-200">
  <select
    value={filterResult}
    onChange={(e) => setFilterResult(e.target.value)}
    className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 
               shadow-sm transition-all duration-200 
               hover:border-blue-400 hover:bg-blue-50 
               focus:ring-2 focus:ring-blue-400 focus:outline-none"
  >
    <option value="">All Results</option>
    <option value="win">Wins</option>
    <option value="loss">Losses</option>
    <option value="draw">Draws</option>
  </select>

  <select
    value={filterTimeControl}
    onChange={(e) => setFilterTimeControl(e.target.value)}
    className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 
               shadow-sm transition-all duration-200 
               hover:border-blue-400 hover:bg-blue-50 
               focus:ring-2 focus:ring-blue-400 focus:outline-none"
  >
    <option value="">All Time Controls</option>
    <option value="1+0">Bullet (1+0)</option>
    <option value="3+0">Blitz (3+0)</option>
    <option value="5+0">Blitz (5+0)</option>
    <option value="10+0">Rapid (10+0)</option>
    <option value="15+10">Rapid (15+10)</option>
  </select>

  <input
    type="text"
    placeholder="Search opening (ECO or name)..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="flex-1 min-w-48 px-4 py-2 rounded-lg border border-gray-300 
               bg-gray-50 text-gray-700 shadow-sm 
               transition-all duration-200 
               hover:border-green-400 hover:bg-green-50 
               focus:ring-2 focus:ring-green-400 focus:outline-none"
  />
</div>


      {/* Games Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
            <tr>
              <th 
                className="px-4 py-3 cursor-pointer hover:bg-gray-200 transition"
                onClick={() => handleSort('date')}
              >
                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3">Opponent</th>
              <th 
                className="px-4 py-3 cursor-pointer hover:bg-gray-200 transition"
                onClick={() => handleSort('rating')}
              >
                Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3">Color</th>
              <th className="px-4 py-3">Result</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Opening</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAndSortedGames.map((game) => {
              const opponent = getOpponentInfo(game, username)
              const result = getPlayerResult(game, username)
              const playerColor =
                game.players.white.user?.id === username.toLowerCase() ? 'white' : 'black'

              return (
                <tr
                  key={game.id}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  {/* Date (black text) */}
                  <td className="px-4 py-3 text-gray-900">{formatGameDate(game.createdAt)}</td>

                  {/* Opponent */}
                  <td className="px-4 py-3 font-medium text-gray-800">{opponent.name}</td>

                  {/* Rating (black text) */}
                  <td className="px-4 py-3 text-gray-900">{opponent.rating || 'Unrated'}</td>

                  {/* Color circle */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block w-4 h-4 rounded-full ${
                        playerColor === 'white'
                          ? 'bg-gray-100 border-2 border-gray-400'
                          : 'bg-gray-800'
                      }`}
                    ></span>
                  </td>

                  {/* Result */}
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold ${
                        result === 'Win'
                          ? 'text-green-600'
                          : result === 'Loss'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {result}
                    </span>
                  </td>

                  {/* Time (black text) */}
                  <td className="px-4 py-3 text-gray-900">{formatTimeControl(game.clock)}</td>

                  {/* Opening */}
                  <td className="px-4 py-3">
                    {game.opening ? (
                      <div>
                        <div className="font-medium text-gray-800">{game.opening.name}</div>
                        <div className="text-xs text-gray-500">{game.opening.eco}</div>
                      </div>
                    ) : (
                      'Unknown'
                    )}
                  </td>

                  {/* Action Link */}
                  <td className="px-4 py-3">
                    <Link
                      to={`/game/${game.id}`}
                      className="text-green-600 hover:underline font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filteredAndSortedGames.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No games match the current filters.</p>
        </div>
      )}
    </div>
  )
}

export default GamesList
