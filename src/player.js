// Player Module

import {player1} from '.';
import {Dom} from './dom';
import {Gameboard} from './gameboard';

/** Player Constructor */
export class Player {
	/**
	 * Create a Player
	 * @param {string} [name] Player Name
	 * - 'Player 1' by default
	 * @param {number} [num=1] Are you Player 1 or Player 2?
	 * @param {boolean} [ai=false] Is `Player` a computer?
	 */
	constructor(name = 'Player 1', num = 1, ai = false) {
		this.name = name;
		this.player = num;
		this.board = new Gameboard(num);
		this.ai = ai;
	}

	/**
	 * `Player` makes their move/Takes their turn
	 *
	 * @param {HTMLDivElement} cell The `Cell` or Space you are making
	 * your move at
	 * - `Cell`/Space on the gameboard
	 * @param {Player | Computer} otherPlayer Your opponent
	 *
	 * @return {data} Object containing data about the attack
	 */
	makeMove(cell, otherPlayer) {
		const coord = [
			cell.parentElement.getAttribute('data'),
			cell.getAttribute('data'),
		];

		// Attack opponent
		const attackData = otherPlayer.board.recieveAttack(coord);

		// If cell was already shot, dont remove listener, just return data
		if (attackData.alreadyShot) return attackData;

		// Remove all listeners for Player
		Dom.cellListeners.remove(this.player);

		return attackData;
	}
}

/**
 * Computer Constructor
 * @extends Player
 */
export class Computer extends Player {
	/**
	 * Create a Computer for `Player` to play against
	 * - Not a 'smart' computer
	 */
	constructor() {
		super('Computer', 2, true);
	}

	/**
	 * Make a random, legal move
	 * @param {Player} opponent Player 1
	 *
	 * @return {data|object} Object containing move data
	 */
	makeRandomMove() {
		const legalMoves = this.#getLegalMoves();
		const num = this.#getRandomNumber(legalMoves.length-1); // Num from 1-length
		/*
		- Get the random cell by getting Player 1's gameboard
		- Get the child that is the chosen legal moves X coord
		- Get the childs child that is the chosen legal moves Y coord
		*/
		const cell =
			document.querySelector('#player1').children[legalMoves[num][0]]
				.children[legalMoves[num][1]];

		// Make Move
		return this.makeMove(cell, player1);
	}

	/**
	 * Get random number between 1 and `n`
	 * @param {number} n Highest number
	 * @return {number}
	 */
	#getRandomNumber = (n) => Math.floor(Math.random() * n);

	/**
	 * Get the legal moves Computer can make
	 * - Dont shoot somewhere thats already been shot
	 *
	 * @return {Array} Legal move coordinates
	 */
	#getLegalMoves() {
		const legalMoves = [];

		const grid = player1.board.grid;
		// Iterate through the grid
		for (let x = 0; x < 10; x++) {
			for (let y = 0; y < 10; y++) {
				// If the Cell hasnt been shot
				// Push the coordinates to array
				if (!grid[x][y].shot) legalMoves.push(grid[x][y].coord);
			}
		}

		return legalMoves;
	}

	/**
	 * Place random ships for the `Computer`
	 */
	placeComputerShips() {
		const emptySpaces = this.#getEmptySpaces();
		const lengths = [5, 4, 3, 3, 2]; // Lengths of ships

		for (let i = 0; i < 5; i++) {
			// Get name from Length
			let name;
			if (i == 0) name = 'aircraft-carrier';
			else if (i == 1) name = 'battle-ship';
			else if (i == 2) name = 'destroyer';
			else if (i == 3) name = 'submarine';
			else if (i == 4) name = 'patrol-boat';
			else throw Error('Error placing Computer Ships');

			let space;
			let isVerticle;
			let valid;
			do {
				// Get random empty space
				space = emptySpaces[this.#getRandomNumber(emptySpaces.length)];

				// If random num is even, verticle = true
				isVerticle = this.#getRandomNumber(4) % 2 == 0 ? true : false;
				// Place ship
				valid = this.board.placeShip(space, name, lengths[i], isVerticle);
			} while (!valid); // If placement is invalid, do it all again
		}
	}

	/**
	 * @private
	 * Get the spaces that dont have a ship on them
	 * - So Computer doesnt place 2 ships in the same spot
	 *
	 * @return {Number[]} Array of coordinates
	 */
	#getEmptySpaces() {
		const emptySpaces = [];
		// Loop through Computer Cells
		for (let x = 0; x < 10; x++) {
			for (let y = 0; y < 10; y++) {
				const cell = this.board.grid[x][y];
				// If cell doesnt have a ship && hasnt been shot
				if (!cell.hasShip && !cell.shot) emptySpaces.push(cell.coord);
			}
		}

		return emptySpaces;
	}
}
