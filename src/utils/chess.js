// Opening book moves database (simplified)
const OPENING_BOOK = {
  // Starting position
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -': {
    'e2e4': true, 'd2d4': true, 'g1f3': true, 'c2c4': true
  },
  // After 1.e4
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3': {
    'e7e5': true, 'c7c5': true, 'e7e6': true, 'c7c6': true, 'd7d6': true
  },
  // After 1.e4 e5
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6': {
    'g1f3': true, 'f2f4': true, 'b1c3': true
  },
  // Add more opening book positions as needed
}

/**
 * Analyzes where a game deviates from opening book
 * @param {Array} moves - Array of moves in SAN notation
 * @param {Array} positions - Array of FEN positions after each move
 * @returns {Object} Analysis result with deviation point
 */
export function analyzeOpeningDeviation(moves, positions) {
  if (!moves || !positions || moves.length === 0) {
    return {
      deviationMove: null,
      deviationPly: null,
      inBookMoves: 0,
      analysis: 'No moves to analyze'
    }
  }

  let lastBookPosition = null
  let deviationPly = null
  let inBookMoves = 0

  for (let i = 0; i < moves.length && i < positions.length; i++) {
    const position = positions[i]
    const move = moves[i]
    
    // Check if current position exists in opening book
    if (OPENING_BOOK[position]) {
      // Check if the move played is in the book for this position
      if (OPENING_BOOK[position][move]) {
        lastBookPosition = position
        inBookMoves++
      } else {
        // Move is not in book - this is the deviation
        deviationPly = i + 1
        break
      }
    } else {
      // Position not in book - previous move was the last book move
      if (i > 0) {
        deviationPly = i
      }
      break
    }
  }

  return {
    deviationMove: deviationPly ? moves[deviationPly - 1] : null,
    deviationPly,
    inBookMoves,
    analysis: deviationPly 
      ? `Deviation from opening theory at move ${deviationPly}: ${moves[deviationPly - 1]}`
      : 'Game stayed in opening book throughout analyzed moves'
  }
}

/**
 * Calculates player statistics from games array
 * @param {Array} games - Array of game objects
 * @param {string} username - Username to calculate stats for
 * @returns {Object} Player statistics
 */
export function calculatePlayerStats(games, username) {
  if (!games || games.length === 0) {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      whiteWins: 0,
      whiteGames: 0,
      blackWins: 0,
      blackGames: 0,
      whiteWinPercentage: 0,
      blackWinPercentage: 0,
      mostPlayedOpening: null
    }
  }

  const stats = {
    totalGames: games.length,
    wins: 0,
    losses: 0,
    draws: 0,
    whiteWins: 0,
    whiteGames: 0,
    blackWins: 0,
    blackGames: 0
  }

  const openings = {}
  
  games.forEach(game => {
    const playerColor = game.players.white.user?.id === username.toLowerCase() ? 'white' : 'black'
    const opponent = playerColor === 'white' ? game.players.black : game.players.white
    
    // Count games by color
    if (playerColor === 'white') {
      stats.whiteGames++
    } else {
      stats.blackGames++
    }
    
    // Count results
    if (game.status === 'draw' || game.winner === undefined) {
      stats.draws++
    } else if (game.winner === playerColor) {
      stats.wins++
      if (playerColor === 'white') {
        stats.whiteWins++
      } else {
        stats.blackWins++
      }
    } else {
      stats.losses++
    }
    
    // Track openings
    if (game.opening) {
      const openingKey = `${game.opening.name} (${game.opening.eco})`
      openings[openingKey] = (openings[openingKey] || 0) + 1
    }
  })
  
  // Calculate win percentages
  stats.whiteWinPercentage = stats.whiteGames > 0 
    ? Math.round((stats.whiteWins / stats.whiteGames) * 100) 
    : 0
  stats.blackWinPercentage = stats.blackGames > 0 
    ? Math.round((stats.blackWins / stats.blackGames) * 100) 
    : 0
  
  // Find most played opening
  stats.mostPlayedOpening = Object.entries(openings).length > 0
    ? Object.entries(openings).reduce((a, b) => openings[a[0]] > openings[b[0]] ? a : b)[0]
    : null
  
  return stats
}

/**
 * Formats a timestamp to a readable date string
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date string
 */
export function formatGameDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Formats time control string to readable format
 * @param {Object} clock - Clock object with initial and increment
 * @returns {string} Formatted time control
 */
export function formatTimeControl(clock) {
  if (!clock) return 'Unknown'
  
  const minutes = Math.floor(clock.initial / 60)
  const increment = clock.increment || 0
  
  return `${minutes}+${increment}`
}

/**
 * Gets the result string for a player in a game
 * @param {Object} game - Game object
 * @param {string} username - Username to get result for
 * @returns {string} Result string ('Win', 'Loss', 'Draw')
 */
export function getPlayerResult(game, username) {
  if (game.status === 'draw' || game.winner === undefined) {
    return 'Draw'
  }
  
  const playerColor = game.players.white.user?.id === username.toLowerCase() ? 'white' : 'black'
  return game.winner === playerColor ? 'Win' : 'Loss'
}

/**
 * Gets the opponent information for a player in a game
 * @param {Object} game - Game object  
 * @param {string} username - Username to get opponent for
 * @returns {Object} Opponent information
 */
export function getOpponentInfo(game, username) {
  const playerColor = game.players.white.user?.id === username.toLowerCase() ? 'white' : 'black'
  const opponent = playerColor === 'white' ? game.players.black : game.players.white
  
  return {
    name: opponent.user?.id || 'Anonymous',
    rating: opponent.rating || 0,
    playerColor: playerColor === 'white' ? 'black' : 'white'
  }
}