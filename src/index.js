/* Battle-Ship Main
Start: 9/5/23 */

import {Dom} from './dom';
import {Game} from './game';
import {Computer, Player} from './player';

// Create Players
export const player1 = new Player();
// Initialize Game
export const game = new Game();

// Add ships to DOM
Dom.createShips();
Dom.mobileLayout();

// Allow ships to be dropped inside cells
const cells = document.querySelectorAll('#player1 .cell');
cells.forEach((cell) => {
	cell.addEventListener('dragover', Dom.dragDrop.dragover);

	cell.addEventListener('drop', (e) => {
		// Get the ship / Drop the ship into cell
		const {ship, left} = Dom.dragDrop.onDrop(e);
		const shipName = ship.classList[0]; // Get Name of ship from its first class
		// If ship doesnt have 'rotate' class: true
		const isVerticle = ship.classList.contains('rotate') ? false : true;

		const coord = [
			Number(cell.parentElement.getAttribute('data')),
			Number(cell.getAttribute('data')),
		];

		// If p1's turn, place in their board
		if (game.turn === 1) {
			const valid = player1.board.placeShip(
				coord,
				shipName,
				Number(ship.getAttribute('data')),
				isVerticle,
			);

			// If placement is invalid (Ships would overlap)
			if (!valid) {
				Dom.shipReset(ship);
				ship.style.left = left;
				document.querySelector('.move-info .turn')
					.innerHTML = 'Invalid ship placement!<br>Try again';
			}

			// If all p1 ships are placed and p2 is not an AI
			if (player1.board.activeShips.length === 5 &&
				!game.player2.ai) {
				// Let p2 place their ships
				game.p2PlaceShips();
			}

		// If p2 is not an AI && its p2 turn
		} else if (!game.player2.ai && game.turn === 2) {
			// Place in p2 board
			const valid = game.player2.board.placeShip(coord, shipName,
				Number(ship.getAttribute('data')),
				isVerticle);

			// If placement is invalid (Ships would overlap)
			if (!valid) {
				Dom.shipReset(ship);
				if (ship.clientHeight == 0) ship.style.left = left;
				document.querySelector('.move-info .turn')
					.innerHTML = 'Invalid ship placement!<br>Try again';
			}
		}

		// Check if all ships are placed
		if (player1.board.activeShips.length === 5 &&
			game.player2.board.activeShips.length === 5) {
			// Start Game
			game.startGame();
		}
	});
});

// Remove 'dragging' class from Ship imgs if they are inside the container still
const shipContainer = document.querySelector('.ship-container');
shipContainer.addEventListener('dragover', Dom.dragDrop.shipContainerReset);
shipContainer.addEventListener('drop', Dom.dragDrop.shipContainerReset);

// Rotate Ships on btn click
const rotateBtn = document.querySelector('.rotate-btn');
rotateBtn.addEventListener('click', () => {
	Dom.rotateShips(); // Rotate ships inside container
	// Flip container to column instead of row
	document.querySelector('.ship-container').classList.toggle('column');
});

const transScreen = document.querySelector('.transition');
transScreen.addEventListener('click', Dom.toggleTransition);

// Create p2 and hide Start Screen on click
const startBtn = document.querySelector('.start');
startBtn.addEventListener('click', () => {
	game.createP2();
	Dom.toggleStartScreen();
});
