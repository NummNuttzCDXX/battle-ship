// Ship Test Module

import {Ship} from '../ship';

describe('Ship Constructor', () => {
	const testShip = new Ship(5);

	test('Hit sucessful', () => {
		expect(testShip.hit()).toBe(1);
	});

	test('Ship Sinks', () => {
		const smallShip = new Ship(2);
		smallShip.hit();
		smallShip.hit();

		expect(smallShip.isSunk()).toBe(true);
	});
});
