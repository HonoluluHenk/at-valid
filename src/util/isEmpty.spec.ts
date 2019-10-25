import {isEmpty} from "./isEmpty";

describe('isEmpty', () => {
	it('should return true for null', () => {
		expect(isEmpty(null))
				.toBe(true);
	});
	it('should return true for undefined', () => {
		expect(isEmpty(undefined))
				.toBe(true);
	});
	it('should be false for everything else', () => {
		expect(isEmpty(0))
				.toBe(false);
		expect(isEmpty(NaN))
				.toBe(false);
		expect(isEmpty(""))
				.toBe(false);
		expect(isEmpty({}))
				.toBe(false);
		expect(isEmpty([]))
				.toBe(false);
		expect(isEmpty(Symbol()))
				.toBe(false);
		expect(isEmpty(() => 'foobar'))
				.toBe(false);
		// ESNext
		// expect(isEmpty(0n))
		// 		.toBe(false);
	});
});