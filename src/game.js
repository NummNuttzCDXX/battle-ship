// Game Module - Handle game functions

import {player1} from '.';
import {Dom} from './dom';
import {Computer, Player} from './player';

/**
 * Game Module
 * - Handle game functions
 */
export class Game {
	/**
	 * Construct main Game Module
	 */
	constructor() {
		/** Is the game running? */
		this.game = false;
		/** Whos turn is it? */
		this.turn = 1;

		/**
		 * @type {Player|Computer} Player 2
		 * - Saving p2 as a property in Game Module will make it easier to `export`
		 * the variable since p2 is created dynamically and could be a `Player` or
		 * `Computer`
		 */
		this.player2 = null;
	}

	/**
	 * Create Player 2 and save to Property `player2`
	 * - Player 2 will either be a `Player` or `Computer`
	 * depending on what option is selected on `Start Screen`
	 */
	createP2 = () => {
		const singleBtn = document.querySelector('#single-player');
		/**
		 * If the `single-player` radio button is checked,
		 * will be true, else false
		 *
		 * @type {boolean}
		 */
		const singlePlayer = singleBtn.checked;

		if (singlePlayer) {
			// Create Computer
			this.player2 = new Computer();
			// Place their ships
			this.player2.placeComputerShips();
		} else {
			this.player2 = new Player('Player 2', 2);
		}
	};

	startGame = () => {
		if (this.game) {
			throw Error('Error starting game. Cant start game twice');
		} else {
			this.game = true;
		}

		this.createP2();
		Dom.cellListeners.createCallbacks();

		Dom.toggleStartScreen();

		// Start player1's turn
		Dom.cellListeners.add(this.turn);
	};

	/**
	 * Switch turns and add current player's listeners to board
	 * OR Computer takes their turn
	 * - Runs after Player takes their turn
	 */
	makeMove = () => {
		if (!this.game) return; // If game is not playing, return

		this.#switchTurns();

		// If its p1's turn
		if (this.turn === 1) {
			Dom.cellListeners.add(this.turn); // Add p1 listeners
		// If p2 is computer and its their turn
		} else if (this.player2.ai && this.turn === 2) {
			// AI makes their move
			this.player2.makeRandomMove();

			// Switch turns and add p1 listeners
			this.makeMove();
		// If p2 is NOT an AI and its their turn
		} else if (!this.player2.ai && this.turn === 2) {
			// Switch Gameboards // Render p2 gameboard
			Dom.renderGameboards(this.player2, player1);
			Dom.cellListeners.add(this.turn); // Add p2 listeners
		} else {
			throw Error('Error making a move');
		}
	};

	gameOver = () => {
		alert('Gameover'); // TEMP
		this.game = false;
	};

	/**
	 * Alternate whos turn it is, player1 or player2
	 *
	 * @return {number} Whos turn it is
	 * - 1 or 2
	 */
	#switchTurns = () => this.turn === 1 ? this.turn = 2 : this.turn = 1;
};
