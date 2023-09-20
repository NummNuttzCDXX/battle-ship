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

// Allow ships to be dropped inside cells
const cells = document.querySelectorAll('#player1 .cell');
cells.forEach((cell) => {
	cell.addEventListener('dragover', (e) => e.preventDefault());

	cell.addEventListener('drop', (e) => {
		// Get the ship / Drop the ship into cell
		const ship = Dom.dragDrop.onDrop(e);
		const shipName = ship.classList[0]; // Get Name of ship from its first class
		// If ship doesnt have 'rotate' class: true
		const isVerticle = ship.classList[1] ? false : true;

		const coord = [
			Number(cell.parentElement.getAttribute('data')),
			Number(cell.getAttribute('data')),
		];

		// If p1's turn, place in their board
		if (game.turn === 1) {
			player1.board.placeShip(
				coord,
				shipName,
				Number(ship.getAttribute('data')),
				isVerticle,
			);

			// If all p1 ships are placed and p2 is not an AI
			if (player1.board.activeShips.length === 5 &&
				!game.player2.ai) {
				// Let p2 place their ships
				game.p2PlaceShips();
			}

		// If p2 is not an AI && its p2 turn
		} else if (!game.player2.ai && game.turn === 2) {
			// Place in p2 board
			game.player2.board.placeShip(coord, shipName,
				Number(ship.getAttribute('data')),
				isVerticle);
		}

		// Check if all ships are placed
		if (player1.board.activeShips.length === 5 &&
			game.player2.board.activeShips.length === 5) {
			// Start Game
			game.startGame();
		}
	});
});

// Rotate Ships on btn click
const rotateBtn = document.querySelector('.rotate-btn');
rotateBtn.addEventListener('click', () => {
	Dom.rotateShips(); // Rotate ships inside container
	// Flip container to column instead of row
	document.querySelector('.ship-container').classList.toggle('column');
});

// Create p2 and hide Start Screen on click
const startBtn = document.querySelector('.start');
startBtn.addEventListener('click', () => {
	game.createP2();
	Dom.toggleStartScreen();
});
