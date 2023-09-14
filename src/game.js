// Game Module - Handle game functions

import {player1, player2} from '.';
import {Dom} from './dom';

/**
 * Game Module
 * - Handle game functions
 */
export const Game = (() => {
	/** Is the game running? */
	let game = false;
	/** Whos turn is it? */
	let turn = 1;

	const startGame = () => {
		if (game) {
			throw Error('Error starting game. Cant start game twice');
		} else {
			game = true;
		}

		// Start player1's turn
		Dom.cellListeners.add(turn);
	};

	/**
	 * Switch turns and add current player's listeners to board
	 * OR Computer takes their turn
	 * - Runs after Player takes their turn
	 */
	const makeMove = () => {
		if (!game) return; // If game is not playing, return

		switchTurns();

		// If its p1's turn
		if (turn === 1) {
			Dom.cellListeners.add(turn); // Add p1 listeners
		// If p2 is computer and its their turn
		} else if (player2.ai && turn === 2) {
			// AI makes their move
			player2.makeRandomMove();

			// Switch turns and add p1 listeners
			makeMove();
		// If p2 is NOT an AI and its their turn
		} else if (!player2.ai && turn === 2) {
			// Switch Gameboards // Render p2 gameboard
			Dom.renderGameboards(player2, player1);
			Dom.cellListeners.add(turn); // Add p2 listeners
		} else {
			throw Error('Error making a move');
		}
	};

	const gameOver = () => {
		alert('Gameover'); // TEMP
		game = false;
	};

	/**
	 * Alternate whos turn it is, player1 or player2
	 *
	 * @return {number} Whos turn it is
	 * - 1 or 2
	 */
	const switchTurns = () => turn === 1 ? turn = 2 : turn = 1;

	return {game, turn, startGame, makeMove, gameOver};
})();
