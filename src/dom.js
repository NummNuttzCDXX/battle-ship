// DOM Manipulation Module

// Image Imports
import carrier from './assets/img/aircraft-carrier.svg'; // 5
import battle from './assets/img/battle-ship.svg'; // 4
import destroy from './assets/img/destroyer.svg'; // 3
import sub from './assets/img/submarine.svg'; // 3
import patrol from './assets/img/patrol.svg'; // 2

export const Dom = (() => {
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

		// Battle Ship
		const battleShip = new Image(getCellWidth());
		battleShip.classList.add('battle-ship');
		battleShip.src = battle;
		battleShip.alt = 'Battle Ship';

		// Destroyer
		const destroyer = new Image(getCellWidth());
		destroyer.classList.add('destroyer');
		destroyer.src = destroy;
		destroyer.alt = 'Destroyer';

		// Submarine
		const submarine = new Image(getCellWidth());
		submarine.classList.add('submarine');
		submarine.src = sub;
		submarine.alt = 'Submarine';

		// Patrol Boat
		const patrolBoat = new Image(getCellWidth());
		patrolBoat.classList.add('patrol-boat');
		patrolBoat.src = patrol;
		patrolBoat.alt = 'Patrol Boat';

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
		 */
		const onDrop = (event) => {
			event.preventDefault();
			const data = event.dataTransfer.getData('text');
			event.target.appendChild(document.querySelector(`[src="${data}"]`));
		};

		return {makeShipsDraggable, onDrop};
	})();

	/** @return {number} Gameboard Cell's width */
	const getCellWidth = () => document.querySelector('.cell').clientWidth;

	return {createShips, dragDrop};
})();
