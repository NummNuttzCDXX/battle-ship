// Gameboard Module

import {Dom} from './dom';
import {game} from '.';
import {Ship} from './ship';

/** Gameboard Constructor */
export class Gameboard {
	/**
	 * Construct Grid/Board
	 *
	 * @param {number} player Whos gameboard is this?
	 * - Player `1` or Player `2`
	 */
	constructor(player) {
		this.player = player;

		/**
		 * The Grid/Board holding the columns and cells (X, Y)
		 * - You can access a particular cell by `board[x][y]`
		 * - `board` is an Array of nested Arrays representing the columns
		 * or X coord
		 * - The nested Arrays hold Cell Objects that contain `coord` property,
		 * which is another array, `hasShip` property to tell you if there is a
		 * ship on that cell, and `shot` property to tell if it has been shot
		 */
		this.grid = this.#createGrid();
		/** @type {Ship[]} */
		this.activeShips = [];
		/** @type {Number[][]} Array coords */
		this.shotsTaken = [];
	}

	/**
	 * Create Grid Array
	 *
	 * @return {Array[]}
	*/
	#createGrid() {
		const board = [];

		for (let x = 0; x < 10; x++) {
			const col = []; // Create Column (X coord)

			for (let y = 0; y < 10; y++) {
				// Create Cell Obj which has coordinates,
				// If the cell has a Ship on it, and if it was shot
				/**
				 * @typedef {Object} cell Cell on Gameboard
				 * @prop {number[]} coord Coordinates
				 * @prop {boolean} hasShip Does this cell have a ship on it?
				 * @prop {boolean} shot Has this cell been shot already?
				 * @prop {Ship | null} ship Link to `Ship` if there is a ship on this
				 * cell
				 */
				const cell = {coord: [x, y], hasShip: false, shot: false, ship: null};
				col.push(cell); // Push Cell to Column
			}

			board.push(col); // Push Column to Board
		}

		return board;
	}

	/**
	 * Place a ship at `coord`
	 *
	 * @param {number[]} coord Array of coordinates
	 * @param {string} name Name of ship
	 * @param {number} len Length of ship
	 * @param {boolean} [isVerticle] Is the ship placed vertically (up/down) or
	 * horizontally (left/right)?
	 * - `true` by default
	 *
	 * @return {Ship} Newly created `Ship`
	 */
	placeShip(coord, name, len, isVerticle = true) {
		// Error Checks
		if (coord[0] > 9 || coord[1] > 9) throw new Error('Invalid coordinate');
		else if (len > 5 || len < 2) throw new Error('Invalid ship length');

		const ship = new Ship(name, len);
		this.activeShips.push(ship);

		if (isVerticle) {
			/* Set y equal to `coord`s Y coord
			loop while y doesnt equal y - length of ship
			we decrement y to move Y coord down and set the cells
			`hasShip` prop to true */
			const dif = coord[1] - len;
			for (let y = coord[1]; y !== dif; y--) {
				// Get cell and set hasShip to true
				const cell = this.grid[coord[0]][y];
				cell.hasShip = true;
				cell.ship = ship; // Link Cell to Ship
			}
		} else {
			// Else ship goes from left to right
			/* Set x equal to `coord`s X coord
			loop while x doesnt equal x + length of ship
			increment x to move the X coord up and set the corrosponding
			cell's `hasShip` prop to true */
			const dif = coord[0] + len;
			for (let x = coord[0]; x !== dif; x++) {
				const cell = this.grid[x][coord[1]]; // Get cell
				cell.hasShip = true; // Set hasShip to true
				cell.ship = ship; // Link Cell to Ship
			}
		}

		return ship;
	}

	/**
	 * Recieve an attack from the Opponent
	 * - Check whether or not the Attack hit a `Ship`
	 * - Send `hit()` to correct `Ship`
	 *
	 * @param {number[]} coord Array of coordinates
	 */
	recieveAttack(coord) {
		const cell = this.grid[coord[0]][coord[1]];
		// Check if cell has been shot already
		// Throw Error FOR NOW
		if (cell.shot) throw Error('Cell has already been shot');
		else {
			cell.shot = true;
			this.shotsTaken.push(coord); // Record shot
		}

		// Check if attack hit a ship
		if (cell.hasShip) {
			cell.ship.hit(); // Hit ship

			// Add hit to board
			const isOppBoard = this.player === 1 ? false : true;
			Dom.addHit(coord, isOppBoard);

			// Check if ship is sunk
			if (cell.ship.isSunk()) {
				// Find index of ship in `activeShips`
				const index = this.activeShips.indexOf(cell.ship);
				// Error check
				if (index === -1) throw Error('Cannot find Ship in `activeShips`');

				this.activeShips.splice(index, 1);

				// Check if all ships sunk
				if (this.#checkShips()) {
					// GAME OVER
					game.gameOver();
				}
			}
		// Else shot missed
		} else {
			// Add miss
			if (this.player === 1) {
				Dom.addMiss(coord, false);
			} else {
				Dom.addMiss(coord, true);
			}
		}
	}

	/**
	 * Check if all ships are sunk
	 * @private
	 *
	 * @return {boolean}
	 */
	#checkShips = () => this.activeShips.length === 0 ? true : false;
}
