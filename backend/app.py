from flask import Flask, request, jsonify
from flask_cors import CORS
import chess
import chess.engine
import chess.pgn
from io import StringIO

app = Flask(__name__)
CORS(app)

# Initialize Stockfish engine
STOCKFISH_PATH = "/usr/local/bin/stockfish"  # Adjust path as needed
# STOCKFISH_PATH = "/path/to/stockfish"


def analyze_game_with_stockfish(pgn_string, depth=10):
    """
    Analyze a chess game using Stockfish
    
    Args:
        pgn_string: PGN string of the game
        depth: Analysis depth (default 10)
    
    Returns:
        Dictionary with analysis results
    """
    try:
        # Parse PGN
        pgn_io = StringIO(pgn_string)
        game = chess.pgn.read_game(pgn_io)
        
        if not game:
            return {"error": "Invalid PGN"}
        
        board = game.board()
        moves = list(game.mainline_moves())
        
        # Initialize Stockfish
        with chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH) as engine:
            evaluations = []
            mistakes = []
            blunders = []
            
            # Analyze each position
            for i, move in enumerate(moves):
                # Get evaluation before the move
                info = engine.analyse(board, chess.engine.Limit(depth=depth))
                score_before = info["score"].relative
                
                # Make the move
                board.push(move)
                
                # Get evaluation after the move
                info_after = engine.analyse(board, chess.engine.Limit(depth=depth))
                score_after = info_after["score"].relative
                
                # Convert scores to centipawns
                cp_before = score_before.score(mate_score=10000) if score_before else 0
                cp_after = -score_after.score(mate_score=10000) if score_after else 0  # Negate because it's opponent's turn
                
                # Calculate score change
                score_change = cp_after - cp_before
                
                evaluations.append({
                    "ply": i + 1,
                    "move": move.uci(),
                    "san": board.san(board.pop() and board.push(move) or move),
                    "score_before": cp_before,
                    "score_after": cp_after,
                    "score_change": score_change
                })
                
                # Identify mistakes and blunders
                if score_change <= -150:  # Mistake threshold
                    error_type = "blunder" if score_change <= -300 else "mistake"
                    error_data = {
                        "ply": i + 1,
                        "move": move.uci(),
                        "san": board.san(board.pop() and board.push(move) or move),
                        "score_change": score_change,
                        "type": error_type
                    }
                    
                    if error_type == "blunder":
                        blunders.append(error_data)
                    else:
                        mistakes.append(error_data)
        
        return {
            "success": True,
            "evaluations": evaluations,
            "mistakes": mistakes,
            "blunders": blunders,
            "total_moves": len(moves)
        }
        
    except Exception as e:
        return {"error": str(e)}

@app.route('/api/analyze', methods=['POST'])
def analyze_game():
    """
    Endpoint to analyze a chess game with Stockfish
    
    Expected JSON payload:
    {
        "pgn": "PGN string",
        "depth": 10 (optional)
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'pgn' not in data:
            return jsonify({"error": "PGN required"}), 400
        
        pgn = data['pgn']
        depth = data.get('depth', 10)
        
        # Analyze the game
        result = analyze_game_with_stockfish(pgn, depth)
        
        if "error" in result:
            return jsonify(result), 400
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Test Stockfish connection
        with chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH) as engine:
            return jsonify({
                "status": "healthy",
                "stockfish": "connected"
            })
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)