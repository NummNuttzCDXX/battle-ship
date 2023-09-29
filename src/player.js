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
		let coord = cell;
		if (!Array.isArray(coord)) {
			coord = [
				cell.parentElement.getAttribute('data'),
				cell.getAttribute('data'),
			];
		}

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
		/**
		 * @type {number[][]} Array of coordinates
		 * @description When a shot hits a ship, `push`
		 * coordinates of adjacent spaces here
		 */
		this.adjacent = [];
		/** Coordinate of last Hit */
		this.lastHit = null;
		/** Coordinate of previous Hit, before `lastHit` */
		this.prevHit = null;
		/** Coordinate of first Hit on a ship */
		this.firstHit = null;
		this.nextHit = null;
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
		const data = this.makeMove(cell, player1);
		// If the attack hit and didnt sink
		if (data.hit && !data.sunk) {
			// Push adjacent coords to arr
			this.pushAdjacent(legalMoves[num]);
			this.firstHit = legalMoves[num];
			this.lastHit = legalMoves[num];
		}

		return data;
	}

	/**
	 * Attack the adjacent cell of a previously hit cell
	 * 1. Attack next adjacent cell
	 * 2. If it hit, save `lastHit` and `prevHit` (previous hit before last)
	 * 3. Next time, compare `prevHit` to `lastHit` and attack the next cell
	 * in the same line.
	 * 	- So, in theory, it should attack the whole Ship, once
	 * it knows what direction the Ship is going in
	 * @example
	 * This will run when it is Computers turn, and `this.adjacent` has anything
	 * inside it.
	 *
	 * @return {object} Data about the attack
	 * @throws {Error} If comparing `lastHit` to `prevHit` fails
	 */
	runAdjacentHit() {
		let coord = !this.nextHit ? this.adjacent.pop() : this.nextHit;
		let data;
		// If there is a next hit
		if (this.nextHit != null) {
			data = this.makeMove(this.nextHit, player1); // Attk nextHit
			this.nextHit = null; // Reset nextHit
		// If there is a previous hit
		} else if (this.prevHit != null) {
			// Compare previous to last and attk the next cell in line
			if (this.lastHit[0] > this.prevHit[0]) {
				// Check if next move goes off the board
				// If doesnt go off board and hasnt been shot
				if (this.lastHit[0] + 1 < 10 &&
					!player1.board.grid[this.lastHit[0] + 1][this.lastHit[1]].shot) {
					// Attk next move in straight line
					coord = [this.lastHit[0] + 1, this.lastHit[1]];
					data = this.makeMove(coord, player1);
				} else { // If calculated move is off the board
					// Since we know next move WOULD be X + 1, attack firstHit X - 1
					coord = [this.firstHit[0] - 1, this.firstHit[1]];
					data = this.makeMove(coord, player1);
				}
			} else if (this.lastHit[0] < this.prevHit[0]) {
				if (this.lastHit[0] - 1 >= 0 &&
					!player1.board.grid[this.lastHit[0] - 1][this.lastHit[1]].shot) {
					coord = [this.lastHit[0] - 1, this.lastHit[1]];
					data = this.makeMove(coord, player1);
				} else {
					coord = [this.firstHit[0] + 1, this.firstHit[1]];
					data = this.makeMove(coord, player1);
				}
			} else if (this.lastHit[1] > this.prevHit[1]) {
				if (this.lastHit[1] + 1 < 10 &&
					!player1.board.grid[this.lastHit[0]][this.lastHit[1] + 1].shot) {
					coord = [this.lastHit[0], this.lastHit[1] + 1];
					data = this.makeMove(coord, player1);
				} else {
					coord = [this.firstHit[0], this.firstHit[1] - 1];
					data = this.makeMove(coord, player1);
				}
			} else if (this.lastHit[1] < this.prevHit[1]) {
				if (this.lastHit[1] - 1 >= 0 &&
					!player1.board.grid[this.lastHit[0]][this.lastHit[1] - 1].shot) {
					coord = [this.lastHit[0], this.lastHit[1] - 1];
					data = this.makeMove(coord, player1);
				} else {
					coord = [this.firstHit[0], this.firstHit[1] + 1];
					data = this.makeMove(coord, player1);
				}
			} else {
				throw Error('Unable to attack adjacent cell');
			}
		// If there is no previous hit
		} else {
			data = this.makeMove(coord, player1);
		}

		// If attack hit but didnt sink
		if (data.hit && !data.sunk) {
			this.prevHit = this.lastHit;
			this.lastHit = coord;
		// If adjacent cell attack missed
		} else if (data.miss && this.lastHit != null || data.alreadyShot) {
			// Compare firstHit with lastHit to calculate the next move
			// If the last hits X is > first hits X
			if (this.lastHit[0] > this.firstHit[0]) {
				// Next hit is first hits X - 1
				this.nextHit = [this.firstHit[0] - 1, this.firstHit[1]];
			// If last hits X is < first hits X
			} else if (this.lastHit[0] < this.firstHit[0]) {
				// Next hit is 1 above the first hit
				this.nextHit = [this.firstHit[0] + 1, this.firstHit[1]];
			} else if (this.lastHit[1] > this.firstHit[1]) {
				this.nextHit = [this.firstHit[0], this.firstHit[1] - 1];
			} else if (this.lastHit[1] < this.firstHit[1]) {
				this.nextHit = [this.firstHit[0], this.firstHit[1] + 1];
			} else if (this.lastHit != this.firstHit) {
				throw Error('Error calculating next hit');
			}

			if (data.alreadyShot) {
				data = this.makeMove(this.nextHit, player1);
			}
		// If attk sunk a Ship
		} else if (data.sunk) {
			// Reset last/prev hits, they do not matter anymore
			this.prevHit = null;
			this.lastHit = null;
			this.firstHit = null;
			this.adjacent = [];
		}

		return data;
	}

	/**
	 * Attack adjacent spaces when Computer gets a hit
	 * @param {number[]} coord The space thats been hit
	 */
	pushAdjacent(coord) {
		if (typeof coord[0] !== 'number' || typeof coord[1] !== 'number') {
			throw Error('Coordinates are not numbers');
		}
		// Push adjacent coordinates to arr
		// If adjacent coord is not hit
		if (coord[0] < 9 && !player1.board.grid[coord[0] + 1][coord[1]].shot) {
			this.adjacent.push([coord[0] + 1, coord[1]]);
		}
		if (coord[0] > 0 && !player1.board.grid[coord[0] - 1][coord[1]].shot) {
			this.adjacent.push([coord[0] - 1, coord[1]]);
		}
		if (coord[1] < 9 && !player1.board.grid[coord[0]][coord[1] + 1].shot) {
			this.adjacent.push([coord[0], coord[1] + 1]);
		}
		if (coord[1] > 0 && !player1.board.grid[coord[0]][coord[1] - 1].shot) {
			this.adjacent.push([coord[0], coord[1] - 1]);
		}
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
