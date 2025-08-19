import { describe, it, expect } from 'vitest'
import { analyzeOpeningDeviation, calculatePlayerStats, getPlayerResult } from '../utils/chess'

describe('Chess Utils', () => {
  describe('analyzeOpeningDeviation', () => {
    it('should handle empty moves array', () => {
      const result = analyzeOpeningDeviation([], [])
      expect(result.deviationMove).toBe(null)
      expect(result.deviationPly).toBe(null)
      expect(result.inBookMoves).toBe(0)
    })

    it('should analyze simple opening deviation', () => {
      const moves = ['e4', 'e5', 'unusual_move']
      const positions = [
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -',
        'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3',
        'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6'
      ]
      
      const result = analyzeOpeningDeviation(moves, positions)
      expect(result.inBookMoves).toBeGreaterThan(0)
    })
  })

  describe('calculatePlayerStats', () => {
    it('should handle empty games array', () => {
      const stats = calculatePlayerStats([], 'testuser')
      expect(stats.totalGames).toBe(0)
      expect(stats.wins).toBe(0)
      expect(stats.losses).toBe(0)
      expect(stats.draws).toBe(0)
    })

    it('should calculate basic stats correctly', () => {
      const games = [
        {
          players: {
            white: { user: { id: 'testuser' }, rating: 1500 },
            black: { user: { id: 'opponent' }, rating: 1400 }
          },
          winner: 'white',
          status: 'mate',
          opening: { name: 'Sicilian Defense', eco: 'B20' }
        },
        {
          players: {
            white: { user: { id: 'opponent' }, rating: 1450 },
            black: { user: { id: 'testuser' }, rating: 1500 }
          },
          winner: 'white',
          status: 'mate',
          opening: { name: 'Queen\'s Gambit', eco: 'D06' }
        }
      ]

      const stats = calculatePlayerStats(games, 'testuser')
      expect(stats.totalGames).toBe(2)
      expect(stats.wins).toBe(1)
      expect(stats.losses).toBe(1)
      expect(stats.draws).toBe(0)
      expect(stats.whiteGames).toBe(1)
      expect(stats.blackGames).toBe(1)
    })
  })

  describe('getPlayerResult', () => {
    it('should return correct result for win', () => {
      const game = {
        players: {
          white: { user: { id: 'testuser' } },
          black: { user: { id: 'opponent' } }
        },
        winner: 'white'
      }

      const result = getPlayerResult(game, 'testuser')
      expect(result).toBe('Win')
    })

    it('should return correct result for loss', () => {
      const game = {
        players: {
          white: { user: { id: 'testuser' } },
          black: { user: { id: 'opponent' } }
        },
        winner: 'black'
      }

      const result = getPlayerResult(game, 'testuser')
      expect(result).toBe('Loss')
    })

    it('should return correct result for draw', () => {
      const game = {
        players: {
          white: { user: { id: 'testuser' } },
          black: { user: { id: 'opponent' } }
        },
        status: 'draw'
      }

      const result = getPlayerResult(game, 'testuser')
      expect(result).toBe('Draw')
    })
  })
})