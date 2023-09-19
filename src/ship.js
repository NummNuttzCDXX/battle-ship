// Ship Module

/** Ship Constructor */
export class Ship {
	/**
	 * The ship has properties
	 * - name
	 * - `len`gth
	 * - hits
	 * - sunk {boolean}
	 * - verticle {boolean}
	 *
	 * @param {string} name Name of ship:
	 * - Carrier
	 * - Battle
	 * - Destroyer
	 * - Sub
	 * - Patrol
	 * @param {number} len Length
	 * - Represents length of ship in `units` on the gameboard
	 * @param {boolean} [isVerticle=true] Is the Ship placed vertically?
	 * (up & down)
	 */
	constructor(name, len, isVerticle = true) {
		this.name = name;
		this.length = len;
		this.isVerticle = isVerticle;
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
