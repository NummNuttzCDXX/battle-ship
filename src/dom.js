// DOM Manipulation Module

// Image Imports
import carrier from './assets/img/aircraft-carrier.svg'; // 5
import battle from './assets/img/battle-ship.svg'; // 4
import destroy from './assets/img/destroyer.svg'; // 3
import sub from './assets/img/submarine.svg'; // 3
import patrol from './assets/img/patrol.svg'; // 2
import xIcon from './assets/img/x-icon.svg';
import {Player, Computer} from './player';
import {player1, game} from '.';

export const Dom = (() => {
	/**
	 * Manipulate event listeners on the Cells of
	 * the gameboard
	 * @module cellListeners
	 * @param {Player} currentPlayer Player to add/remove cell listeners
	 * @return {Function}
	 */
	const cellListeners = (() => {
		/**
		 * Listen for clicks on cells to make a move there
		 *
		 * @param {number} playerNum The player number whos
		 * event listeners you want to remove
		 * - `player1` = `1`
		 * - `player2` = `2`
		 */
		const add = (playerNum) => {
			const p = `p${playerNum}`;

			const cells = document.querySelectorAll(`#player2 .cell`);
			cells.forEach((cell) => {
				const callback =
					callbacks[p][cell.parentElement.getAttribute('data')][
						cell.getAttribute('data')
					];

				cell.addEventListener('click', callback);
			});
		};

		/**
		 * Remove event listeners from Cells
		 *
		 * @param {number} playerNum The player number whos
		 * event listeners you want to remove
		 * - `player1` = `1`
		 * - `player2` = `2`
		 */
		const remove = (playerNum) => {
			const p = `p${playerNum}`;

			const cells = document.querySelectorAll(`#player2 .cell`);
			cells.forEach((cell) => {
				const callback =
					callbacks[p][cell.parentElement.getAttribute('data')][
						cell.getAttribute('data')
					];

				cell.removeEventListener('click', callback);
			});
		};

		/**
		 * Create callback functions for the players that can be used
		 * for adding/removing the event listeners to the cells when making
		 * a move
		 * - Set `callback` property to be the Created Callbacks
		 */
		const createCallbacks = () => {
			// Create Arrays for p1/p2 callbacks
			const callbacks1 = [];
			const callbacks2 = [];

			// Get columns on board (Listeners will always be added to player2 board)
			const cols = document.querySelectorAll('#player2 .col');
			cols.forEach((col) => {
				// For each column create 1 column Array for each player
				const column1 = [];
				const column2 = [];

				// Get cells in the current column
				const cells = col.querySelectorAll('.cell');

				cells.forEach((cell) => {
					// For each cell, create player1 callback
					const player1Callback = () => {
						// Make player1's move
						player1.makeMove(cell, game.player2);

						game.makeMove();
					};
					column1.push(player1Callback); // Push callback

					// Create player2 callback
					const player2Callback = () => {
						game.player2.makeMove(cell, player1);

						game.makeMove();
					};
					column2.push(player2Callback); // push
				});

				// Add players column array to their corrosponding callback Array
				callbacks1.push(column1);
				callbacks2.push(column2);
			});

			// Return Object holding player1 and 2's callbacks
			callbacks = {p1: callbacks1, p2: callbacks2};
		};

		// Save the callbacks for player event listeners^^
		let callbacks;

		return {add, remove, createCallbacks};
	})();

	/**
	 * Add a marker (X) to a cell where a miss occurred
	 *
	 * @param {number[]} coord Coordinates
	 * - Where? Which cell/space
	 * @param {boolean} boardIsOpponent Is the board
	 * you are adding a marker to the opponents? (true)
	 */
	const addMiss = (coord, boardIsOpponent) => {
		let cell;
		if (boardIsOpponent) {
			cell = document.querySelector(`#player2 .col[data="${coord[0]}"]`)
				.querySelector(`.cell[data="${coord[1]}"]`);
		} else {
			cell = document.querySelector(`#player1 .col[data="${coord[0]}"]`)
				.querySelector(`.cell[data="${coord[1]}"]`);
		}

		// Create X image to place in cell
		const X = new Image(getCellWidth() - 10);
		X.src = xIcon;
		X.alt = 'Cell has been shot';
		X.classList.add('x-icon');

		cell.appendChild(X);
	};

	/**
	 * Add a hit marker to the board
	 *
	 * @param {number[]} coord Coordinates to add the hit
	 * @param {boolean} [isOpponentBoard=true] Is the hit on the opponents board?
	 */
	const addHit = (coord, isOpponentBoard = true) => {
		// Get cell
		const board = isOpponentBoard ? 'player2' : 'player1';
		const cell = document.querySelector(`#${board} .col[data="${coord[0]}"]`)
			.querySelector(`.cell[data="${coord[1]}"]`);

		cell.classList.add('hit');
	};

	/**
	 * Add the ships to the DOM
	 * (NOT on the gameboard)
	 * where Player can drag and drop them on the board
	 */
	const createShips = () => {
		// Create container
		const shipContainer = document.createElement('div');
		shipContainer.classList.add('ship-container');

		// Create ship images
		// Aircraft Carrier
		const airCarrier = new Image(getCellWidth());
		airCarrier.classList.add('aircraft-carrier');
		airCarrier.src = carrier;
		airCarrier.alt = 'Aircraft Carrier';
		airCarrier.setAttribute('data', '5');

		// Battle Ship
		const battleShip = new Image(getCellWidth());
		battleShip.classList.add('battle-ship');
		battleShip.src = battle;
		battleShip.alt = 'Battle Ship';
		battleShip.setAttribute('data', '4');

		// Destroyer
		const destroyer = new Image(getCellWidth());
		destroyer.classList.add('destroyer');
		destroyer.src = destroy;
		destroyer.alt = 'Destroyer';
		destroyer.setAttribute('data', '3');

		// Submarine
		const submarine = new Image(getCellWidth());
		submarine.classList.add('submarine');
		submarine.src = sub;
		submarine.alt = 'Submarine';
		submarine.setAttribute('data', '3');

		// Patrol Boat
		const patrolBoat = new Image(getCellWidth());
		patrolBoat.classList.add('patrol-boat');
		patrolBoat.src = patrol;
		patrolBoat.alt = 'Patrol Boat';
		patrolBoat.setAttribute('data', '2');

		// Add to container
		shipContainer.appendChild(airCarrier);
		shipContainer.appendChild(battleShip);
		shipContainer.appendChild(destroyer);
		shipContainer.appendChild(submarine);
		shipContainer.appendChild(patrolBoat);
		document.querySelector('.content').appendChild(shipContainer);

		// Allow ships to be 'dragged'
		dragDrop.makeShipsDraggable();
	};

	/**
	 * Render `player`'s board based on their
	 * `Gameboard` Object
	 * @link See 'Player.board'
	 *
	 * @param {Player} player Current Player
	 * @param  {Player | Computer} opponent Your opponent
	 * - You dont want to render the current opponents ships
	 */
	const renderGameboards = (player, opponent) => {
		const playerBoard = player.board.grid;

		// Loop through Players Gameboard backwards to place ships correctly
		for (let x = 9; x >= 0; x--) {
			for (let y = 0; y < 10; y++) {
				const cell = playerBoard[x][y];
				// Get the Actual cell on DOM from `cell`'s coordinates
				const realCell =
					document.querySelector(`#player1 .col[data="${cell.coord[0]}"]`)
						.querySelector(`.cell[data="${cell.coord[1]}"]`);

				// If Cell has a ship on it
				if (cell.hasShip) {
					// Place ship inside cell
					const shipName = cell.ship.name;
					const shipImg = document.querySelector(`.${shipName}`);

					realCell.appendChild(shipImg);

					if (cell.shot) addHit(cell.coord, false);
				// If cell doesnt have ship but HAS been shot
				} else if (cell.shot) {
					addMiss(cell.coord, false);
				}
			}
		}

		// Get opponent Board
		const oppBoard = opponent.board.grid;

		// Loop through opponents board to place markers on shot spaces
		for (const col of oppBoard) {
			for (const cell of col) {
				// If cell has ship and has been shot, add hit
				if (cell.hasShip && cell.shot) addHit(cell.coord, true);
				// Else if cell doesnt have a ship but has been shot, add miss
				else if (cell.shot) addMiss(cell.coord, true);
			}
		}
	};

	/**
	 * Drag and Drop Module holding methods needed
	 * for dragging and dropping `Ship` images
	 * - Separate module for organization
	 */
	const dragDrop = (() => {
		const makeShipsDraggable = () => {
			const ships = document.querySelectorAll('.ship-container img');

			ships.forEach((ship) => {
				makeDraggable(ship); // Set drag attr to true

				ship.addEventListener('drag', (e) => onDrag(e));
			});
		};

		/**
		 * Make `element` draggable
		 * @param {...HTMLElement} elements Element to make 'draggable'
		 * - Any number of elements
		 */
		const makeDraggable = (...elements) => {
			for (const element of elements) {
				element.setAttribute('draggable', 'true');
			}
		};

		/**
		 * Set the data to be dragged
		 * - Data will be the class name of the
		 * dragged element
		 * @param {DragEvent} event
		 */
		const onDrag = (event) => {
			event.dataTransfer.setData('text', event.target.className);
		};

		/**
		 * On drop, get the set data (elements class)
		 * and append the element to the Events target
		 * (where you dropped it)
		 * @param {Event} event Drop Event
		 *
		 * @return {HTMLImageElement} The Ship Image being dropped
		 */
		const onDrop = (event) => {
			event.preventDefault();
			const data = event.dataTransfer.getData('text'); // Get data
			const ship = document.querySelector(`[src="${data}"]`); // Get ship
			event.target.appendChild(ship); // Add ship to cell

			return ship;
		};

		return {makeShipsDraggable, onDrop};
	})();

	/** Hide/Show Starting Screen */
	const toggleStartScreen = () => {
		const startScreen = document.querySelector('.start-screen');
		startScreen.classList.toggle('hide');
	};

	/** @return {number} Gameboard Cell's width */
	const getCellWidth = () => document.querySelector('.cell').clientWidth;

	return {createShips, dragDrop, renderGameboards, cellListeners, addMiss,
		addHit, toggleStartScreen};
})();
