import React, { useState, useEffect } from 'react'
import PlayerSearch from '../components/PlayerSearch'
import PlayerStats from '../components/PlayerStats'
import GamesList from '../components/GamesList'
import ErrorMessage from '../components/ErrorMessage'
import LichessAPI from '../api/lichess'
import { calculatePlayerStats } from '../utils/chess'

function Dashboard() {
  const [games, setGames] = useState(null)
  const [stats, setStats] = useState(null)
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (searchUsername) => {
    setLoading(true)
    setError('')
    setGames(null)
    setStats(null)

    try {
      // Fetch player games
      const playerGames = await LichessAPI.getPlayerGames(searchUsername, 50)
      
      if (playerGames.length === 0) {
        setError(`No games found for user "${searchUsername}". Please check the username and try again.`)
        return
      }

      // Calculate stats
      const playerStats = calculatePlayerStats(playerGames, searchUsername)
      
      setGames(playerGames)
      setStats(playerStats)
      setUsername(searchUsername)
      
    } catch (err) {
      console.error('Search error:', err)
      if (err.response?.status === 404) {
        setError(`User "${searchUsername}" not found. Please check the username and try again.`)
      } else {
        setError('Failed to fetch player data. Please try again later.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chess Player Insights</h1>
        <p className="text-gray-600">
          Search for any Lichess player to view their game statistics and recent matches.
        </p>
      </div>

      <PlayerSearch onSearch={handleSearch} loading={loading} />

      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={() => username && handleSearch(username)}
        />
      )}

      {(loading || stats) && (
        <PlayerStats 
          stats={stats} 
          username={username} 
          loading={loading} 
        />
      )}

      {(loading || games) && (
        <GamesList 
          games={games} 
          username={username} 
          loading={loading} 
        />
      )}
    </div>
  )
}

export default Dashboard