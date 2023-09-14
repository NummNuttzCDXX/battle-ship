/* Battle-Ship Main
Start: 9/5/23 */

import {Dom} from './dom';
import {Game} from './game';
import {Computer, Player} from './player';

// Create Players
export const player1 = new Player();
export const player2 = new Computer();

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
			cell.parentElement.getAttribute('data'),
			cell.getAttribute('data'),
		];
		player1.board.placeShip(coord, shipName, ship.getAttribute('data'),
			isVerticle);

		// Check if all ships are placed
		if (document.querySelector('.ship-container').children.length === 0) {
			// Enable 'Start Button'
			document.querySelector('.start').disabled = false;
		}
	});
});

// Start Game on click
const startBtn = document.querySelector('.start');
startBtn.addEventListener('click', () => {
	// Start game
	Game.startGame();
});
