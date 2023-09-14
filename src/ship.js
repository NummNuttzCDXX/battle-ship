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

	/**
	 * Calculate the `transform-origin` the Ship Image
	 * needs to be in order to rotate correctly
	 *
	 * @return {string} The value that `transform-origin` style
	 * needs to be
	 */
	calcTransformOrigin = () => {
		/* When the ship rotates on screen, the Origin of rotation needs to be
		the center of the first cell the ship is in, otherwise it will be the
		center of the image and it wont be positioned correctly.

		Need to get the percentage of the image that is inside the first cell,
		then set half of that as the Transform Origin. */
		/** @type {number} Percentage of img to rotate at */
		const transOrigin = (100 / this.length) / 2;

		return `50% ${transOrigin}%`;
	};
}
