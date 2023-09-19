// Ship Module

/** Ship Constructor */
export class Ship {
	/**
	 * The ship has properties
	 * - `len`gth
	 * - hits
	 * - sunk {boolean}
	 *
	 * @param {string} name Name of ship:
	 * - Carrier
	 * - Battle
	 * - Destroyer
	 * - Sub
	 * - Patrol
	 * @param {number} len Length
	 * - Represents length of ship in `units` on the gameboard
	 */
	constructor(name, len) {
		this.name = name;
		this.length = len;
		this.hits = 0;
		this.sunk = false;
	}

	/**
	 * Increment hits property
	 * @return {number} Number of hits
	 */
	hit = () => ++this.hits;

	/**
	 * Check if ship is sunk
	 * - Is this ship sunk?
	 *
	 * @return {boolean}
	 */
	isSunk = () => {
		return this.hits >= this.length ? true : false;
	};
}
