// Gameboard Module

import {Dom} from './dom';
import {game, player1} from '.';
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
	 * @return {Ship|null} - Newly created `Ship`
	 * - `Null` if placement is invalid
	 */
	placeShip(coord, name, len, isVerticle = true) {
		// Error Checks
		if (coord[0] > 9 || coord[1] > 9) throw new Error('Invalid coordinate');
		else if (len > 5 || len < 2) throw new Error('Invalid ship length');
		// Check if placement is valid
		else if (!this.#checkValidShipPlacement(coord, len, isVerticle)) {
			return null;
		}

		const ship = new Ship(name, len, isVerticle);
		this.activeShips.push(ship);

		if (isVerticle) {
			const dif = coord[1] - len;
			// Check if Ship will go off the board
			if (dif < 0) {
				// If ship will go off the board, place ship from bottom edge
				for (let y = 0; y < len; y++) {
					const cell = this.grid[coord[0]][y];
					cell.hasShip = true;
					cell.ship = ship; // Link cell to Ship
				}
			// Else if ship wont go off the board
			} else if (dif >= 0) {
				for (let y = coord[1]; y !== dif; y--) {
					// Get cell and set hasShip to true
					const cell = this.grid[coord[0]][y];
					cell.hasShip = true;
					cell.ship = ship; // Link Cell to Ship
				}
			} else throw Error('Error placing ship');
		// Else ship is horizontal (left to right)
		} else {
			const dif = Number(coord[0]) + (len - 1);
			// If placement goes off the board
			if (dif > 9) {
				for (let x = 9; x > 9 - len; x--) {
					const cell = this.grid[x][coord[1]];
					cell.hasShip = true;
					cell.ship = ship;
				}
			} else if (dif <= 9) {
				for (let x = coord[0]; x <= dif; x++) {
					const cell = this.grid[x][coord[1]];
					cell.hasShip = true;
					cell.ship = ship;
				}
			} else throw Error('Error placing ship');
		}

		return ship;
	}

	/**
	 * Check if the Ship placed at `coord` is valid
	 * - Will this placement overlap other Ships?
	 *
	 * @param {number[]} coord Coordinates that the top of the ship will
	 * be in
	 * - First coordinate
	 * @param {number} len Length of Ship
	 * @param {boolean} isVerticle Will the Ship be placed vertically?
	 *
	 * @return {boolean}
	 * @throws Will throw Error if `isVerticle` is not `true` | `false`
	 */
	#checkValidShipPlacement(coord, len, isVerticle) {
		const p = this.player == 1 ? player1 : game.player2; // Get player

		// Loop through cells the Ship WOULD be placed in
		if (isVerticle) {
			// `l` is used for checking spaces that are off the board
			for (let y = coord[1], l = len; y > coord[1] - len; y--, l--) {
				const cell = p.board.grid[coord[0]][y];
				// If cell = undefined (placement is off the board)
				if (!cell) {
					// Loop through spaces that are off the board
					for (let i = l; i > 0; i--) {
						// Place the cells that are off the board above the first Y & check
						const cell = p.board.grid[coord[0]][coord[1] + i];
						if (cell.hasShip) return false;
					}
					break;
				}

				// If cell has a ship, Placement is invalid
				if (cell.hasShip) return false;
			}
		} else if (isVerticle === false) {
			for (let x = coord[0], l = len; x < coord[0] + len; x++, l--) {
				const col = p.board.grid[x];

				// If cell = undefined (placement is off the board)
				if (!col) {
					// Loop through spaces that are off the board
					for (let i = l; i > 0; i--) {
						// Place the cells that are off the board above the first X & check
						const cell = p.board.grid[coord[0] - i][coord[1]];
						if (cell.hasShip) return false;
					}
					break;
				}

				const cell = col[coord[1]];
				// If cell has a ship, Placement is invalid
				if (cell.hasShip) return false;
			}
		} else throw Error('Err checking Ship placement');

		return true;
	}

	/**
	 * Recieve an attack from the Opponent
	 * - Check whether or not the Attack hit a `Ship`
	 * - Send `hit()` to correct `Ship`
	 *
	 * @param {number[]} coord Array of coordinates
	 *
	 * @return {data} Holds attack data
	 * - Hit ship?
	 * - Miss?
	 */
	recieveAttack(coord) {
		const cell = this.grid[coord[0]][coord[1]];

		/**
		 * - Return what happened during the attack
		 * - Properties will be `undefined` if they are
		 * irrelevant
		 * @typedef {object} data about the attack
		 * @property {number} player - `1` or `2`
		 * - Which player attacked
		 * @property {?boolean} hit Was the attack a hit?
		 * @property {?string} ship Name of ship that was hit
		 * @property {?boolean} sunk Did the attack sink the ship?
		 * @property {?boolean} miss Did the attack miss?
		 * @property {?boolean} alreadyShot Has the cell already been shot?
		 */
		const data = {};
		data.player = this.player === 1 ? 2 : 1;
		// Check if cell has been shot already
		if (cell.shot) {
			data.alreadyShot = true;
			return data;
		} else {
			cell.shot = true;
			this.shotsTaken.push(coord); // Record shot
		}

		// Check if attack hit a ship
		if (cell.hasShip) {
			data.hit = true; // Log data
			data.ship = cell.ship.name;

			cell.ship.hit(); // Hit ship

			// Add hit to board
			// If p1 is recieving attk & p2 is not AI || p2 is recieving attk, `true`
			const isOppBoard =
				((this.player == 1 && !game.player2.ai) || this.player == 2) ?
					true :
					false;
			Dom.addHit(coord, isOppBoard);

			// Check if ship is sunk
			if (cell.ship.isSunk()) {
				data.sunk = true;

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
			data.miss = true; // Log miss

			// If P1 is recieving the attk AND P2 is a Player || P2 is receiving attk
			const isOppBoard =
				((this.player == 1 && !game.player2.ai) || this.player == 2) ?
					true :
					false;

			// Add miss
			Dom.addMiss(coord, isOppBoard);
		}

		return data;
	}

	/**
	 * Check if all ships are sunk
	 * @private
	 *
	 * @return {boolean}
	 */
	#checkShips = () => this.activeShips.length === 0 ? true : false;
}
