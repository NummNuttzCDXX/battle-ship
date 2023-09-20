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
		// Set turn to 1
		this.turn = 1;

		// Hide ship container
		document.querySelector('.ship-container').style.visibility = 'hidden';

		// Create move callbacks and render p1 board
		Dom.cellListeners.createCallbacks();
		Dom.renderGameboards(player1, this.player2);

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
			// If p2 is not an AI, render board
			// Board doesnt have to change if p2 is Computer
			if (!this.player2.ai) Dom.renderGameboards(player1, this.player2);
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

	/**
	 * Allow p2 to place their ships
	 * - Render p2's gameboard
	 * - Get all the Ship imgs and place them back in
	 * their `.ship-container`
	 *
	 * @return {void}
	 */
	p2PlaceShips = () => {
		// Dont run if P1 Ships arent placed
		if (document.querySelector('.ship-container').children.length !== 1) return;

		// Switch Gameboards
		Dom.renderGameboards(this.player2, player1);
		this.#switchTurns();

		// Get Ship imgs in the correct order
		const shipImgs = [
			document.querySelector('.aircraft-carrier'),
			document.querySelector('.battle-ship'),
			document.querySelector('.destroyer'),
			document.querySelector('.submarine'),
			document.querySelector('.patrol-boat'),
		];
		shipImgs.forEach((img) => {
			const container = document.querySelector('.ship-container');
			container.classList.remove('column');
			img.classList.remove('rotate'); // Reset img if its rotated
			container.appendChild(img); // Add back to container
		});
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
