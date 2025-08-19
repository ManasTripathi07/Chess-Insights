import axios from 'axios'

const LICHESS_API_BASE = 'https://lichess.org/api'

class LichessAPI {
  static async getPlayerGames(username, limit = 50) {
    try {
      const response = await axios.get(
        `${LICHESS_API_BASE}/games/user/${username}`,
        {
          params: {
            max: limit,
            pgnInJson: true,
            clocks: true,
            evals: false,
            opening: true
          },
          headers: {
            'Accept': 'application/x-ndjson'
          }
        }
      )
      
      // Parse NDJSON response
      const games = response.data
        .trim()
        .split('\n')
        .map(line => JSON.parse(line))
      
      return games
    } catch (error) {
      console.error('Error fetching player games:', error)
      throw error
    }
  }

  static async getGame(gameId) {
    try {
      const response = await axios.get(
        `${LICHESS_API_BASE}/game/${gameId}`,
        {
          params: {
            pgnInJson: true,
            clocks: true,
            evals: false,
            opening: true
          }
        }
      )
      
      return response.data
    } catch (error) {
      console.error('Error fetching game:', error)
      throw error
    }
  }

  static async getUserProfile(username) {
    try {
      const response = await axios.get(`${LICHESS_API_BASE}/user/${username}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }
  }
}

export default LichessAPI