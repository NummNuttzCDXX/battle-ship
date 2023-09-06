// Gameboard Test

import {Gameboard} from '../gameboard';
const board = new Gameboard();


test('Place Ship', () => {
	board.placeShip([5, 5], 5, true);

	expect(board.grid[5][5].hasShip && board.grid[5][4].hasShip &&
		board.grid[5][3].hasShip && board.grid[5][2].hasShip &&
		board.grid[5][1].hasShip).toBeTruthy();
});

test('Didnt place ship', () => {
	board.placeShip([5, 5], 5, true);

	expect(board.grid[5, 6].hasShip && board.grid[6, 5].hasShip &&
		board.grid[5, 0].hasShip).toBeFalsy();
});

describe('Recieve Attack', () => {
	const newBoard = new Gameboard();

	test('Hit Ship', () => {
		const ship = newBoard.placeShip([5, 5], 2, true);
		newBoard.recieveAttack([5, 5]);

		expect(ship.hits).toBe(1);
	});

	test('Missed Ship', () => {
		newBoard.recieveAttack([4, 5]);

		expect(newBoard.shotsTaken[0]).toStrictEqual(newBoard.grid[5][5].coord);
	});

	test('Already hit that cell', () => {
		expect(() => newBoard.recieveAttack([5, 5])).toThrow();
	});

	test.skip('All ships sunk', () => {
		newBoard.recieveAttack([5, 4]);

		expect(newBoard.checkShips()).toBe(true);
	});
});
