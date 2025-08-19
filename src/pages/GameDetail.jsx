import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import LichessAPI from '../api/lichess'
import { analyzeOpeningDeviation, formatGameDate, formatTimeControl } from '../utils/chess'
import ErrorMessage from '../components/ErrorMessage'

function GameDetail() {
  const { gameId } = useParams()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openingAnalysis, setOpeningAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    fetchGame()
  }, [gameId])

  const fetchGame = async () => {
    setLoading(true)
    setError('')

    try {
      const gameData = await LichessAPI.getGame(gameId)
      setGame(gameData)
      
      if (gameData.moves && gameData.moves.length > 0) {
        const analysis = analyzeOpeningDeviation(gameData.moves.split(' '), [])
        setOpeningAnalysis(analysis)
      }
    } catch (err) {
      console.error('Error fetching game:', err)
      if (err.response?.status === 404) {
        setError('Game not found. Please check the game ID.')
      } else {
        setError('Failed to fetch game data. Please try again later.')
      }
    } finally {
      setLoading(false)
    }
  }

  const analyzeWithStockfish = async () => {
    if (!game) return
    
    setAnalyzing(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pgn: game.pgn || '',
          moves: game.moves || ''
        })
      })
      
      if (response.ok) {
        const analysis = await response.json()
        console.log('Stockfish analysis:', analysis)
      }
    } catch (err) {
      console.error('Analysis error:', err)
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card p-6 shadow-md rounded-2xl bg-white">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <ErrorMessage message={error} onRetry={fetchGame} />
      </div>
    )
  }

  if (!game) return null

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Navigation */}
      <div>
        <Link 
          to="/" 
          className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Game Header */}
      <div className="card p-6 rounded-2xl shadow-md bg-white border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-white border-b pb-3">Game Detail</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Players */}
          <div>
            <h3 className="font-semibold mb-3 text-white">Players</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition">
                <span className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-gray-100 border border-gray-400 rounded-full"></span>
                  <span className="font-medium text-gray-800">{game.players.white.user?.id || 'Anonymous'}</span>
                </span>
                <span className="text-sm font-semibold text-blue-600">{game.players.white.rating || 'Unrated'}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition">
                <span className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-gray-800 rounded-full"></span>
                  <span className="font-medium text-gray-800">{game.players.black.user?.id || 'Anonymous'}</span>
                </span>
                <span className="text-sm font-semibold text-red-600">{game.players.black.rating || 'Unrated'}</span>
              </div>
            </div>
          </div>

          {/* Game Info */}
          <div>
            <h3 className="font-semibold mb-3 text-white">Game Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-white">Date:</span>
                <span className="font-medium text-indigo-600">{formatGameDate(game.createdAt)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-white">Time Control:</span>
                <span className="font-medium">{formatTimeControl(game.clock)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-white">Result:</span>
                <span className={`font-semibold ${game.winner ? 'text-green-700' : 'text-gray-500'}`}>
                  {game.winner ? `${game.winner} wins` : 'Draw'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Status:</span>
                <span className="font-medium text-white">{game.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Opening Analysis */}
      {game.opening && (
        <div className="card p-6 rounded-2xl shadow-md bg-white border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-white border-b pb-3">Opening Analysis</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4 border hover:bg-gray-100 transition">
            <h3 className="font-semibold text-lg text-indigo-700">{game.opening.name}</h3>
            <p className="text-gray-600">ECO: {game.opening.eco}</p>
          </div>

          {openingAnalysis && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Opening Deviation Analysis</h4>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-800">{openingAnalysis.analysis}</p>
                {openingAnalysis.deviationPly && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Moves in book: <span className="font-medium">{openingAnalysis.inBookMoves}</span></p>
                    <p>Deviation at ply: <span className="font-medium text-red-600">{openingAnalysis.deviationPly}</span></p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Moves */}
      {game.moves && (
        <div className="card p-6 rounded-2xl shadow-md bg-white border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-3">Game Moves</h2>
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap leading-relaxed border hover:bg-gray-100 transition">
            {game.moves}
          </div>
        </div>
      )}

      {/* Stockfish Analysis */}
      <div className="card p-6 rounded-2xl shadow-md bg-white border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-white border-b pb-3">Engine Analysis</h2>
        <p className="text-white mb-4">
          Analyze this game with Stockfish to find critical mistakes and blunders.
        </p>
        
        <button
          onClick={analyzeWithStockfish}
          disabled={analyzing}
          className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50"
        >
          {analyzing ? 'Analyzing...' : 'Analyze with Stockfish'}
        </button>
        
        <div className="mt-4 text-sm text-white">
          <p>* Stockfish analysis requires the Python backend to be running.</p>
        </div>
      </div>
    </div>
  )
}

export default GameDetail
