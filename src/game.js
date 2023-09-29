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
		if (Dom.isScreenSmall()) {
			document.querySelector('.ship-container').classList.add('hide');
		} else {
			document.querySelector('.ship-container').style.visibility = 'hidden';
		}

		// Create move callbacks and render p1 board
		Dom.cellListeners.createCallbacks();
		Dom.renderGameboards(player1, this.player2);

		// Start P1 turn
		document.querySelector('.move-info .turn')
			.textContent = `Player 1's turn`;
		Dom.cellListeners.add(this.turn);
	};

	/**
	 * Switch turns and add current player's listeners to board
	 * OR Computer takes their turn
	 * - Runs after Player takes their turn
	 * @param {string} msg Message to print after turn starts to tell
	 * Current Player what their Opponent did last turn
	 *
	 * @return {void}
	 */
	makeMove = (msg) => {
		if (!this.game) return; // If game is not playing, return

		this.#switchTurns();

		setTimeout(() => {
			// Display whos turn it is
			document.querySelector('.move-info .turn')
				.textContent = `Player ${this.turn}'s turn`;

			if (!this.player2.ai) Dom.switchNames();
		}, 1500);

		const info = document.querySelector('.move-info .info');
		// If its p1's turn
		if (this.turn === 1) {
			// If p2 is not an AI, render board
			// Board doesnt have to change if p2 is Computer
			if (!this.player2.ai) {
				// After 1.5 seconds
				setTimeout(() => {
					Dom.toggleTransition();
					Dom.renderGameboards(player1, this.player2);
					info.textContent = msg;
				}, 1500);
			}
			Dom.cellListeners.add(this.turn); // Add p1 listeners
		// If p2 is computer and its their turn
		} else if (this.player2.ai && this.turn === 2) {
			// 2 second delay
			setTimeout(() => {
				// AI makes their move
				let data;
				// If theres a hit saved
				if (this.player2.lastHit) {
					// Run through cells adjacent to last turns hit
					data = this.player2.runAdjacentHit();
				} else {
					// Otherwise, make random move
					data = this.player2.makeRandomMove();
				}

				Dom.printMoveInfo(data);
				// Switch turns and add p1 listeners
				this.makeMove();
			}, 2000);
		// If p2 is NOT an AI and its their turn
		} else if (!this.player2.ai && this.turn === 2) {
			// After 1.5 seconds
			setTimeout(() => {
				Dom.toggleTransition(); // Show transition screen
				// Switch Gameboards // Render p2 gameboard
				Dom.renderGameboards(this.player2, player1);
				info.textContent = msg;
				Dom.cellListeners.add(this.turn); // Add p2 listeners
			}, 1500);
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
		Dom.switchNames();
		this.#switchTurns();

		const container = document.querySelector('.ship-container');
		container.classList.remove('column');

		// Get Ship imgs in the correct order
		const shipImgs = [
			document.querySelector('.aircraft-carrier'),
			document.querySelector('.battle-ship'),
			document.querySelector('.destroyer'),
			document.querySelector('.submarine'),
			document.querySelector('.patrol-boat'),
		];
		shipImgs.forEach((img) => {
			img.setAttribute('draggable', 'true'); // Make draggable again
			img.classList.remove('rotate'); // Reset img if its rotated
			container.appendChild(img); // Add back to container
		});
	};

	/**
	 * Display winner and Restart button
	 * @param {Player|Computer} winner Who won?
	 */
	gameOver = (winner) => {
		this.game = false;
		const turn = document.querySelector('.turn');
		turn.innerHTML =
			`Game Over! <br> ${winner.name} wins!`;

		turn.classList.add('win');
	};


	/**
	 * Reset everything as if the page is first loaded
	 */
	restart = () => {
		this.game = false;
		this.turn = 1;
		// Clear boards
		player1.board.clearBoard();
		Dom.clearBoards();

		// Clear move-info text fields
		const moveInfo = document.querySelectorAll('.turn, .info');
		moveInfo.forEach((box) => {
			box.textContent = '';
			box.classList.remove('win');
		});

		// Remove all cell listeners
		Dom.cellListeners.remove(1);
		Dom.cellListeners.remove(2);

		// Show start screen
		Dom.toggleStartScreen();
	};

	/**
	 * Alternate whos turn it is, player1 or player2
	 *
	 * @return {number} Whos turn it is
	 * - 1 or 2
	 */
	#switchTurns = () => this.turn === 1 ? this.turn = 2 : this.turn = 1;
};
