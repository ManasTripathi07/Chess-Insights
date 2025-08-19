import React from 'react'
import { Trophy, XCircle, MinusCircle, Target, CircleDot, Crown } from 'lucide-react'
import '../index.css';

function PlayerStats({ stats, username, loading }) {
  if (loading) {
    return (
      <div className="card p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="card p-8 mb-8 shadow-lg bg-gradient-to-b from-white to-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {username}'s Statistics
      </h2>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm transition hover:bg-green-50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="text-green-600" />
            <span className="text-2xl font-bold text-green-700">{stats.wins}</span>
          </div>
          <div className="text-sm font-medium text-gray-700 text-center">Wins</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm transition hover:bg-red-50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <XCircle className="text-red-600" />
            <span className="text-2xl font-bold text-red-700">{stats.losses}</span>
          </div>
          <div className="text-sm font-medium text-gray-700 text-center">Losses</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm transition hover:bg-gray-100">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MinusCircle className="text-gray-600" />
            <span className="text-2xl font-bold text-gray-700">{stats.draws}</span>
          </div>
          <div className="text-sm font-medium text-gray-700 text-center">Draws</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm transition hover:bg-blue-50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="text-blue-600" />
            <span className="text-2xl font-bold text-blue-700">{stats.totalGames}</span>
          </div>
          <div className="text-sm font-medium text-gray-700 text-center">Total Games</div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Color Stats */}
        <div className="p-5 border rounded-lg shadow-sm bg-white transition hover:bg-indigo-50">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <CircleDot className="text-indigo-600" /> Color Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">White Win %:</span>
              <span className="font-semibold text-indigo-700">{stats.whiteWinPercentage}%</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Black Win %:</span>
              <span className="font-semibold text-indigo-700">{stats.blackWinPercentage}%</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>White Games:</span>
              <span>{stats.whiteGames}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Black Games:</span>
              <span>{stats.blackGames}</span>
            </div>
          </div>
        </div>

        {/* Opening */}
        <div className="p-5 border rounded-lg shadow-sm bg-white transition hover:bg-yellow-50">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <Crown className="text-yellow-600" /> Most Played Opening
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            {stats.mostPlayedOpening ? (
              <span className="text-base font-mono text-gray-800">{stats.mostPlayedOpening}</span>
            ) : (
              <span className="text-gray-500 text-sm">No opening data</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerStats
