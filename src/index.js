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

// Allow ships to be dropped (&& click & place) inside cells
const cells = document.querySelectorAll('#player1 .cell');
cells.forEach((cell) => {
	cell.addEventListener('dragover', Dom.dragDrop.dragover);

	cell.addEventListener('drop', placeInCell);

	cell.addEventListener('click', placeInCell);


	/**
	 * Do what needs to be done to place the Ship
	 * on the Players Gameboard and Cell when the Ship is
	 * Dragged and Dropped inside the Cell or
	 * when the Ship is `selected` and the Cell is clicked
	 *
	 * @param {Event} e
	 */
	function placeInCell(e) {
		// If no Ship is being dragged or selected, do nothing
		if (!document.querySelector('.dragging') &&
		!document.querySelector('.selected')) return;

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
	}
});

// Allow Ships to be clicked to select/place
const shipImgs = document.querySelectorAll('.ship-container img');
shipImgs.forEach((img) => {
	// Select Ship by clicking (will highlight img)
	img.addEventListener('click', () => Dom.selectShip(img));
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

// If 'Multi-Player' radio btn is selected, Show P2 name input
const radioBtns = document.querySelectorAll('input[type="radio"]');
radioBtns.forEach((btn) => btn.addEventListener('change', () => {
	// Toggle 'hide' class on P2Name inp when MultiPlayer btn changes
	document.querySelector('#name2').parentElement.classList.toggle('hide');
}));

// Create p2 and hide Start Screen on click
const startBtn = document.querySelector('.start');
startBtn.addEventListener('click', () => {
	game.createP2();
	Dom.setPlayerNames();
	Dom.toggleStartScreen();
});
