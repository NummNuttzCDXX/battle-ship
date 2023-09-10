// Player Module

import {player1} from '.';
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
	 */
	makeMove(cell, otherPlayer) {
		const coord = [
			cell.parentElement.getAttribute('data'),
			cell.getAttribute('data'),
		];

		// Attack opponent
		otherPlayer.board.recieveAttack(coord);
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
		this.makeMove(cell, player1);
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
}
