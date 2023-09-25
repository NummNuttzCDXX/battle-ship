// DOM Manipulation Module

// Image Imports
import carrier from './assets/img/aircraft-carrier.svg'; // 5
import battle from './assets/img/battle-ship.svg'; // 4
import destroy from './assets/img/destroyer.svg'; // 3
import sub from './assets/img/submarine.svg'; // 3
import patrol from './assets/img/patrol.svg'; // 2
import xIcon from './assets/img/x-icon.svg';
import {Player, Computer} from './player'; // eslint-disable-line no-unused-vars
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
						const data = player1.makeMove(cell, game.player2);
						const msg = printMoveInfo(data, true); // Print out what happened

						// If cell is not already shot
						if (!data.alreadyShot) game.makeMove(msg); // Switch turns, etc.
					};
					column1.push(player1Callback); // Push callback

					// Create player2 callback
					const player2Callback = () => {
						const data = game.player2.makeMove(cell, player1);
						const msg = printMoveInfo(data, true);

						// If cell is not already shot
						if (!data.alreadyShot) game.makeMove(msg); // Switch turns, etc.
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

		// If cell doesnt have an X already
		if (!cell.querySelector('.x-icon')) {
			// Create X image to place in cell
			const X = new Image(getCellWidth() - 10);
			X.src = xIcon;
			X.alt = 'Cell has been shot';
			X.classList.add('x-icon');

			cell.appendChild(X);
		}
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

		// Add 'rotate' button
		const rotateBtn = document.createElement('button');
		rotateBtn.setAttribute('type', 'button');
		rotateBtn.classList.add('rotate-btn');
		rotateBtn.textContent = 'Rotate';
		shipContainer.appendChild(rotateBtn);

		// Create ship images
		// Aircraft Carrier
		const airCarrier = new Image(getCellWidth(), getCellWidth() * 5);
		airCarrier.classList.add('aircraft-carrier');
		airCarrier.src = carrier;
		airCarrier.alt = 'Aircraft Carrier';
		airCarrier.setAttribute('data', '5');

		// Battle Ship
		const battleShip = new Image(getCellWidth(), getCellWidth() * 4);
		battleShip.classList.add('battle-ship');
		battleShip.src = battle;
		battleShip.alt = 'Battle Ship';
		battleShip.setAttribute('data', '4');

		// Destroyer
		const destroyer = new Image(getCellWidth(), getCellWidth() * 3);
		destroyer.classList.add('destroyer');
		destroyer.src = destroy;
		destroyer.alt = 'Destroyer';
		destroyer.setAttribute('data', '3');

		// Submarine
		const submarine = new Image(getCellWidth(), getCellWidth() * 3);
		submarine.classList.add('submarine');
		submarine.src = sub;
		submarine.alt = 'Submarine';
		submarine.setAttribute('data', '3');

		// Patrol Boat
		const patrolBoat = new Image(getCellWidth(), getCellWidth() * 2);
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

		// Append Before Second Gameboard -- Ships are between both boards
		const p2Name = document.querySelector('#two.name');
		const boardContainer = document.querySelector('.board-container');
		boardContainer.insertBefore(shipContainer, p2Name);

		// shipContainer keeps static width and height
		shipContainer.style.width = shipContainer.clientWidth + 'px';
		shipContainer.style.height = shipContainer.clientHeight + 'px';

		// Allow ships to be 'dragged'
		dragDrop.makeShipsDraggable();
	};

	/**
	 * Change layout / UI for smaller screens
	 * - Will run if the screen is small
	 */
	const mobileLayout = () => {
		// Check if screen is small
		if (!isScreenSmall()) return;

		// Move 'move-info' container into view
		const infoContainer = document.querySelector('.move-info');
		const p2Name = document.querySelector('.name#two');
		const boardContainer = document.querySelector('.board-container');
		boardContainer.insertBefore(infoContainer, p2Name);
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

				// Reset cell // Remove Miss marker and hit class
				realCell.classList.remove('hit');
				if (realCell.querySelector('.x-icon')) {
					realCell.querySelector('.x-icon').remove();
				}

				// If Cell has a ship on it
				if (cell.hasShip) {
					// Place ship inside cell
					const shipName = cell.ship.name;
					const shipImg = document.querySelector(`.${shipName}`);
					shipImg.style.height = getCellWidth() * cell.ship.length + 'px';

					// Check verticallity(?)
					if (cell.ship.isVerticle) shipImg.classList.remove('rotate');
					else shipImg.classList.add('rotate');

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
				const realCell =
					document.querySelector(`#player2 .col[data="${cell.coord[0]}"]`)
						.querySelector(`.cell[data="${cell.coord[1]}"]`);

				// Reset cell // Remove hit class and X Icon, if it has it
				realCell.classList.remove('hit');
				if (realCell.querySelector('.x-icon')) {
					realCell.querySelector('.x-icon').remove();
				}

				// If cell has ship and has been shot, add hit
				if (cell.hasShip && cell.shot) addHit(cell.coord, true);
				// Else if cell doesnt have a ship but has been shot, add miss
				else if (cell.shot) addMiss(cell.coord, true);
			}
		}
	};

	/**
	 * Print the move information to screen
	 * - What happened this turn?
	 * - Ex:
	 * 	- "Player1 sunk your Battle Ship!"
	 * 	- "Player2 shot and missed!"
	 * 	- "Hit!"
	 *
	 * @param {object|data} data Attack data
	 * @param {boolean} [simplified=false] Simplify the message?
	 * Example:
	 * - Before: 'Player2 hit your Battle Ship'
	 * - After: 'Hit!'
	 *
	 * @return {void|string} If `simplified` = true, return the
	 * unsimplified msg, otherwise, void
	 */
	const printMoveInfo = (data, simplified = false) => {
		// If a ship was hit, get the name
		let name;
		if (data.ship) {
			// Get ship name and split the '-' if there is one
			name = data.ship.split('-');
			// Capitalize the first letter in each word in the array
			for (let i = 0; i < name.length; i++) {
				const first = name[i].slice(0, 1);
				const cap = name[i].replace(first, first.toUpperCase());
				name[i] = cap;
			};
		}

		// Parse through data and create message to print
		let msg = '';
		/* If p2 is an AI & P1's turn
		Display different messages if Opponent is Computer,
		since the Computer doesnt need to see the message */
		if (game.player2.ai && game.turn == 1) {
			if (data.sunk) {
				// Set message
				msg += `You sunk Player 2's ${name.join(' ')}!!`;
			} else if (data.hit) {
				msg += `You hit Player 2's ship!`;
			} else if (data.miss) {
				msg += `You shot and missed!`;
			}
		} else {
			msg = `Player ${data.player} `;
			if (data.sunk) {
				// Set message
				msg += `sunk your ${name.join(' ')}!!`;
			} else if (data.hit) {
				msg += `hit your ${name.join(' ')}!`;
			} else if (data.miss) {
				msg += `shot and missed!`;
			}
		}

		const element = document.querySelector('.move-info .info');
		// If cell has already been shot, print it to screen
		if (data.alreadyShot) {
			msg = 'Cell has already been shot! <br> Please go again';
			element.innerHTML = msg;
		} else if (!simplified) {
			element.textContent = msg;
		} else if (simplified) { // If `simplified` msg
			let simple;
			if (msg.includes('sunk')) {
				const player = data.player == 1 ? 2 : 1;
				simple = `You sunk Player ${player}'s ${name.join(' ')}`;
			} else if (msg.includes('miss')) simple = 'You shot and missed!';
			else if (msg.includes('hit')) simple = 'Hit!';

			// Print simplified msg and return unsimplified msg
			element.textContent = simple;
			return msg;
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
			event.target.classList.add('dragging');
		};

		/**
		 * On dragover,
		 * 1. Need to prevent the default action on 'dragover events'
		 * 2. Highlight the squares that the Ship will be placed in,
		 * the square thats being dragged over plus however long the Ship is
		 *
		 * @param {Event} e
		 */
		const dragover = (e) => {
			e.preventDefault(); // Prevent default action

			/** @type {HTMLDivElement} */
			const hoveredCell = e.target;
			const draggedShip = document.querySelector('.dragging');
			const length = Number(draggedShip.getAttribute('data'));

			const xCoord = Number(hoveredCell.parentElement.getAttribute('data'));
			const yCoord = Number(hoveredCell.getAttribute('data'));

			// Add 'hover' class to cells the Ship will be placed on
			// If Ship is rotated (horizontal)
			if (draggedShip.classList.contains('rotate')) {
				// Iterate through X coords
				for (let x = xCoord, i = length; x < xCoord + length; x++, i--) {
					const col = document.querySelector(`.col[data="${x}"]`);

					// If the Ship img is off the board so `col` doesnt exist
					if (!col) {
						/* `i` == how many cells are off the board
						loop `i` times and select the cell where the Ship WOULD be placed */
						for (let j = i; j > 0; j--) {
							const cell = document.querySelector(`.col[data="${xCoord - j}"]`)
								.querySelector(`.cell[data="${yCoord}"]`);
							cell.classList.add('hover', 'placing'); // Temp Class
						}
					} else {
						const cell = col.querySelector(`.cell[data="${yCoord}"]`);
						cell.classList.add('hover');
					}
				}
			} else {
				// Iterate through Y coords
				for (let y = yCoord, i = length; y > yCoord - length; y--, i--) {
					const col = document.querySelector(`.col[data="${xCoord}"]`);
					const cell = col.querySelector(`.cell[data="${y}"]`);

					if (!cell) {
						for (let j = i; j > 0; j--) {
							const cell = col.querySelector(`.cell[data="${yCoord + j}"]`);
							cell.classList.add('hover', 'placing');
						}
					} else {
						cell.classList.add('hover');
					}
				}
			}

			const cells = document.querySelectorAll('.cell.hover');
			cells.forEach((cell) => {
				const coord = [
					cell.parentElement.getAttribute('data'),
					cell.getAttribute('data'),
				];

				// Remove 'hover' class if Ship is not about to be placed their
				// '.cell's should only have '.hover' if the ship is being placed there
				if (draggedShip.classList.contains('rotate') &&
				!cell.classList.contains('placing') && (coord[0] >= xCoord + length ||
				coord[0] < xCoord || coord[1] != yCoord)) {
					cell.classList.remove('hover');
				} else if (!draggedShip.classList.contains('rotate') &&
				!cell.classList.contains('placing') && (coord[0] != xCoord ||
				coord[1] <= yCoord - length || coord[1] > yCoord)) {
					cell.classList.remove('hover');
				}
			});

			// Remove temp 'placing' class
			const tempCells = document.querySelectorAll('.cell.placing');
			tempCells.forEach((cell) => cell.classList.remove('placing'));
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
			ship.classList.remove('dragging');
			const cell = event.target;

			// Check if img goes off of the board
			// If ship is rotated (horizontal)
			if (ship.classList.contains('rotate')) {
				// Get X coord
				const currentX = Number(cell.parentElement.getAttribute('data'));
				// If X plus length of ship is off the board
				if (currentX + (ship.getAttribute('data') - 1) > 9) {
					const length = ship.getAttribute('data') - 1; // Get Ship length
					// Select col(X) to place ship
					const x = document.querySelector(`.col[data="${9 - length}"]`);
					const yCoord = cell.getAttribute('data');
					// Select correct cell of column(x) to append Ship
					x.children[yCoord].appendChild(ship);
				} else {
					cell.appendChild(ship); // Add ship to cell
				}
			// Else ship is Verticle
			} else {
				const currentY = cell.getAttribute('data');
				// If current placement of Ship will be off the board
				if (currentY - (ship.getAttribute('data') - 1) < 0) {
					const length = ship.getAttribute('data') - 1;
					// Append Ship to the last available place
					cell.parentElement.children[length].appendChild(ship);
				} else {
					cell.appendChild(ship); // Add ship to cell
				}
			}

			// Remove placement styles that were only needed for '.ship-container'
			ship.style.top = '';
			const oldLeft = ship.style.left;
			ship.style.left = '';
			ship.setAttribute('draggable', false);

			// Remove 'hover' class from cells
			const hoveredCells = document.querySelectorAll('.cell.hover');
			hoveredCells.forEach((cell) => cell.classList.remove('hover'));

			return {ship: ship, left: oldLeft};
		};

		/**
		 * Drag/Drop Function for the `.ship-container`
		 * - Remove `dragging` class from `Ship` imgs inside the container
		 * - Remove `hover` class from `.cell`s
		 *
		 * @example If User drags a Ship from the container and hovers over the
		 * board (`.dragging` & `.hover` are added to elements) and they change
		 * their mind about what Ship to place at that time.
		 * The 2 classes will still be on those elements, `.cell`s will be
		 * highlighted and multiple ships will have `.dragging` which will mess
		 * up how many `.cell`s are highlighted. This `Event Listener` callback
		 * should fix that (mostly)
		 *
		 * @param {Event} e
		 */
		const shipContainerReset = (e) => {
			e.preventDefault();
			const container = document.querySelector('.ship-container');
			// Remove 'dragging' class from Ships
			Array.from(container.children)
				.forEach((child) => child.classList.remove('dragging'));

			// Remove 'hover' class from Cells
			const hoveredCells = document.querySelectorAll('.cell.hover');
			hoveredCells.forEach((cell) => cell.classList.remove('hover'));
		};

		return {makeShipsDraggable, onDrop, dragover, shipContainerReset};
	})();

	/**
	 * Rotate the ship image
	 */
	const rotateShips = () => {
		const ships = document.querySelectorAll('.ship-container img');
		let spacing = 4; // Space from the top
		ships.forEach((ship) => {
			ship.style.transformOrigin = calcTransformOrigin(ship);
			ship.classList.toggle('rotate'); // Toggle rotate class
			ship.style.top = spacing + 'rem'; // Set space from the top in rem's
			centerShipInContainer(ship); // Center img on X axis
			spacing += 2; // Increment space
		});

		/**
		 * Center the ship img inside `.ship-container` on X axis
		 *
		 * @param {HTMLImageElement} img Ship Image to center
		 */
		function centerShipInContainer(img) {
			const container = document.querySelector('.ship-container');
			const width = container.clientWidth;
			// Get img height (Height is really width but img is rotated)
			const imgWidth = img.clientHeight;

			img.style.left = (width / 2) - (imgWidth / 2) + 'px';
		};
	};

	/**
	 * Calculate the `transform-origin` the Ship Image
	 * needs to be in order to rotate correctly
	 *
	 * @param {HTMLImageElement} shipImg
	 *
	 * @return {string} The value that `transform-origin` style
	 * needs to be
	 */
	const calcTransformOrigin = (shipImg) => {
		/* When the ship rotates on screen, the Origin of rotation needs to be
		the center of the first cell the ship is in, otherwise it will be the
		center of the image and it wont be positioned correctly.

		Need to get the percentage of the image that is inside the first cell,
		then set half of that as the Transform Origin. */
		const length = shipImg.getAttribute('data');
		/** @type {number} Percentage of img to rotate at */
		const transOrigin = (100 / length) / 2;

		return `50% ${transOrigin}%`;
	};

	/**
	 * Reset the Ships position inside `.ship-container`
	 * - Used when the Ship placement is invalid and the image
	 * doesnt get placed inside the `.cell`
	 *
	 * @param {HTMLImageElement} img Ship Image
	 */
	const shipReset = (img) => {
		// Set attr / remove class
		img.setAttribute('draggable', 'true');
		img.classList.remove('dragging');

		const container = document.querySelector('.ship-container');
		// If img is rotated
		if (img.classList.contains('rotate')) {
			// Img will have 'pos: absolute;' so need to place correctly
			const children = container.children;
			// Try to put ship in same spot it was
			let prevChildTop = children[1].style.top.split('rem')[0];
			if (prevChildTop != 4) {
				container.insertBefore(img, children[1]);
				img.style.top = '4rem';
				return;
			}

			// Loop through children and check their 'top' value
			for (let i = 2; i < children.length; i++) {
				const child = children[i];
				const currentChildTop = child.style.top.split('rem')[0];

				if (currentChildTop != Number(prevChildTop) + 2) {
					img.style.top = Number(prevChildTop) + 2 + 'rem';
					container.insertBefore(img, child);
					break;
				} else {
					prevChildTop = currentChildTop;
				}
			}

			if (img.parentElement != container) {
				img.style.top = Number(prevChildTop) + 2 + 'rem';
				container.appendChild(img);
			}

			// Center ship X axis
			const width = container.clientWidth;
			const imgWidth = img.clientHeight;
			img.style.left = (width / 2) - (imgWidth / 2) + 'px';
		} else {
			const order = [
				document.querySelector('.aircraft-carrier'),
				document.querySelector('.battle-ship'),
				document.querySelector('.destroyer'),
				document.querySelector('.submarine'),
				document.querySelector('.patrol-boat'),
			];

			// Place ships in correct order (biggest to smallest)
			const children = container.children;
			for (let i = 0; i < order.length; i++) {
				if (order[i] != children[i + 1] &&
					!order[i].parentElement.classList.contains('cell')) {
					container.insertBefore(order[i], children[i + 1]);
				}
			}
		}
	};

	/** Hide/Show Starting Screen */
	const toggleStartScreen = () => {
		const startScreen = document.querySelector('.start-screen');
		startScreen.classList.toggle('hide');
	};

	/** Toggle transition screen between player turns */
	const toggleTransition = () => {
		document.querySelector('.transition').classList.toggle('hide');
	};

	/** @return {number} Gameboard Cell's width */
	const getCellWidth = () => document.querySelector('.cell').clientWidth;

	/**
	 * Check if User screen is small
	 * @return {boolean}
	 */
	const isScreenSmall = () => {
		return (window.innerWidth <= 750 || window.innerHeight <= 650);
	};

	return {createShips, dragDrop, renderGameboards, cellListeners, addMiss,
		addHit, toggleStartScreen, rotateShips, printMoveInfo, shipReset,
		toggleTransition, mobileLayout, isScreenSmall};
})();
