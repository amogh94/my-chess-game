
var game = new Chess();

const P_INF = 1000000;
const N_INF = -1000000;
const DEPTH = 3;

const KING_VALUE = [
[-50,-40,-30,-20,-20,-30,-40,-50],
[-30,-20,-10,  0,  0,-10,-20,-30],
[-30,-10, 20, 30, 30, 20,-10,-30],
[-30,-10, 30, 40, 40, 30,-10,-30],
[-30,-10, 30, 40, 40, 30,-10,-30],
[-30,-10, 20, 30, 30, 20,-10,-30],
[-30,-30,  0,  0,  0,  0,-30,-30],
[-50,-30,-30,-30,-30,-30,-30,-50]
].reverse();

const QUEEN_VALUE = [
	[-20,-10,-10, -5, -5,-10,-10,-20],
	[-10,  0,  0,  0,  0,  0,  0,-10],
	[-10,  0,  5,  5,  5,  5,  0,-10],
	[-5,  0,  5,  5,  5,  5,  0, -5],
	[0,  0,  5,  5,  5,  5,  0, -5],
	[-10,  5,  5,  5,  5,  5,  0,-10],
	[-10,  0,  5,  0,  0,  0,  0,-10],
	[-20,-10,-10, -5, -5,-10,-10,-20]
].reverse();

const ROOK_VALUE = [
	[0,  0,  0,  0,  0,  0,  0,  0],
	[5, 10, 10, 10, 10, 10, 10,  5],
	[-5,  0,  10,  10,  10,  10,  0, -5],
	[-5,  0,  10,  10,  10,  10,  0, -5],
	[-5,  0,  10,  10,  10,  10,  0, -5],
	[-5,  0,  10,  10,  10,  10,  0, -5],
	[5,  10,  10,  10,  10,  10,  10, 5],
	[0,  0,  0,  5,  5,  0,  0,  0]
];

const BISHOP_VALUE = [
	[-20,-10,-10,-10,-10,-10,-10,-20],
	[-10,  0,  0,  0,  0,  0,  0,-10],
	[-10,  0,  5, 10, 10,  5,  0,-10],
	[-10,  5,  5, 10, 10,  5,  5,-10],
	[-10,  0, 10, 10, 10, 10,  0,-10],
	[-10, 10, 10, 10, 10, 10, 10,-10],
	[-10,  5,  0,  0,  0,  0,  5,-10],
	[-20,-10,-10,-10,-10,-10,-10,-20],
].reverse();

const KNIGHT_VALUE = [
	[-50,-40,-30,-30,-30,-30,-40,-50],
	[-40,-20,  0,  0,  0,  0,-20,-40],
	[-30,  0, 10, 15, 15, 10,  0,-30],
	[-30,  5, 15, 20, 20, 15,  5,-30],
	[-30,  0, 15, 20, 20, 15,  0,-30],
	[-30,  5, 10, 15, 15, 10,  5,-30],
	[-40,-20,  0,  5,  5,  0,-20,-40],
	[-50,-40,-30,-30,-30,-30,-40,-50],
].reverse();

const PAWN_VALUE = [
 [0,  0,  0,  0,  0,  0,  0,  0],
 [5, 10, 10,-20,-20, 10, 10,  5],
 [5, -5,-10,  0,  0,-10, -5,  5],
 [0,  0,  0, 20, 20,  0,  0,  0],
 [5,  5, 10, 25, 25, 10,  5,  5],
 [10, 10, 20, 30, 30, 20, 10, 10],
 [50, 50, 50, 50, 50, 50, 50, 50],
 [ 0,  0,  0,  0,  0,  0,  0,  0],
];

const weights = {
	r:60,
	n:30,
	b:60,
	q:120,
	k:25,
	p:20
};

function updateStatus () {
	var status = ''
	var $status = $('#status')
	var moveColor = 'White'
	if (game.turn() === 'b') {
		moveColor = 'Black'
	}
	// checkmate?
	if (game.in_checkmate()) {
		status = 'Game over, ' + moveColor + ' is in checkmate.'
	}

  	// draw?
  	else if (game.in_draw()) {
    	status = 'Game over, drawn position'
  	}

  	// game still on
  	else {
    	status = moveColor + ' to move'

    	// check?
    	if (game.in_check()) {
      		status += ', ' + moveColor + ' is in check'
    	}
  	}
  	mc++;
  	$status.html(status)
}

function minimax(dgame, depth, isMaximizingPlayer, alpha, beta){
	let bestVal;
	if(depth == DEPTH){
		return {
			minimaxVal: evaluateGame(dgame)
		};
	}else if(isMaximizingPlayer){
		bestVal = N_INF;
		let index = 0;
		let moves = dgame.moves().sort(() => Math.random() - 0.5);
		for(let move of moves){
			dgame.move(move);
			let option = minimax(dgame, depth+1, false, alpha, beta);
			dgame.undo();
			let value = option.minimaxVal;
			bestVal = Math.max( bestVal, value);
			alpha = Math.max( alpha, bestVal);
			if(beta<=alpha){
				return {minimaxVal: bestVal, bestChildIndex: index};
			}
			index++;
		}
		return {minimaxVal: bestVal, bestChildIndex: dgame.moves().length-1};
	}else{
		bestVal = P_INF;
		let index = 0;
		let moves = dgame.moves().sort(() => Math.random() - 0.5);
		for(var move of moves){
			dgame.move(move);
			let option = minimax(dgame, depth+1, true, alpha, beta);
			dgame.undo();
			let value = option.minimaxVal;
			bestVal = Math.min( bestVal, value);
			beta = Math.min( beta, bestVal);
			if(beta<=alpha){
				return {minimaxVal: bestVal, bestChildIndex: index};
			}
			index++;
		}

		return {minimaxVal: bestVal, bestChildIndex: dgame.moves().length-1};
	}
}

function getPieceScore(dgame){
	let arrangement = dgame.board();
	let score = 0;
	for(let i=0;i<arrangement.length;i++){
		for(let j=0;j<arrangement[i].length;j++){
			let cell = arrangement[i][j];
			if(cell!=null && cell.color=='b'){
				switch(cell.type){
					case 'r': score += ROOK_VALUE[i][j]*weights.r; break;
					case 'n': score += KNIGHT_VALUE[i][j]*weights.n; break;
					case 'b': score += BISHOP_VALUE[i][j]*weights.b; break;
					case 'q': score += QUEEN_VALUE[i][j]*weights.q; break;
					case 'k': score += KING_VALUE[i][j]*weights.k; break; //KING_VALUE[i][j];
					default: score += PAWN_VALUE[i][j]*weights.p; break;
				}
			}else if(cell!=null && cell.color=='w'){
				switch(cell.type){
					case 'r': score -= ROOK_VALUE[i][j]*weights.r; break;
					case 'n': score -= KNIGHT_VALUE[i][j]*weights.n; break;
					case 'b': score -= BISHOP_VALUE[i][j]*weights.b; break;
					case 'q': score -= QUEEN_VALUE[i][j]*weights.q; break;
					case 'k': score -= KING_VALUE[i][j]*weights.k; break;
					default: score -= PAWN_VALUE[i][j]*weights.p; break;
				}
			}
		}
	}
	return score;
}

// Evaluation is done from the point of view of computer (maximizer, black)
function evaluateGame(dgame){
	// if computer turn
	// game.turn() returns 'b' if computer turn, then it is maximizing player
	// game.turn() returns 'w' if user turn, then it is minimzing player
	// game.in_checkmate() returns true if current state of the board is checkmate
	// game.in_check() return true if there's a check against
	let score = getPieceScore(dgame);

	let inCheckmate = dgame.in_checkmate();
	let inCheck = dgame.in_check();

	let checkMateScore = inCheckmate?200:0, checkScore = inCheck?100:0;
	if(game.turn()=='b'){
		checkMateScore = 0-checkMateScore;
		checkScore = 0-checkScore;
	}
	
	score += checkMateScore + checkScore;
	return score;
}

let mc = 0;

var board1 = Chessboard('board1',{
	draggable: true,
	dropOffBoard: 'snapback', // this is the default
	showNotation: true,
	snapbackSpeed: 500,
	position: 'start',
	onDragStart: function(source, piece, position, orientation) {
		// do not pick up pieces if the game is over
		if (game.game_over()){
			return false
		}
		// only pick up pieces for the side to move
		if ((game.turn() === 'w' && piece.search(/^b/) !== -1) || (game.turn() === 'b' && piece.search(/^w/) !== -1)){
			return false
		}
	},
	onDrop: function(source, target) {
  		// see if the move is legal
	  	var move = game.move({
		  	from: source,
		  	to: target,
		    promotion: 'q' // NOTE: always promote to a queen for example simplicity
		});
		// illegal move
		if (move === null){
			return 'snapback'
		}
		updateStatus();

		setTimeout(()=>{
		// find and make the move returned by the algorithm
		var moves = game.moves();
		if(mc <= 0){
			game.move(moves[Math.floor(Math.random() * moves.length)]);
		}else{
			var {bestChildIndex, minimaxVal} = minimax(game,0,true,N_INF,P_INF);
	   	 	console.log(bestChildIndex, minimaxVal);
			game.move(moves[bestChildIndex]);
		}
   	 	
		board1.position(game.fen());
		updateStatus();
	},500);
		
	},
  	onSnapEnd: function () {
  		board1.position(game.fen());
  	}
});
