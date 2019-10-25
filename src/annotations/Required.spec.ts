import {DecoratorValidator} from "../validator/DecoratorValidator";
import {Required} from "./Required";

// @Foobar('class')
class Foo {
	@Required()
	public bar?: string;

	constructor(bar?: string) {
		this.bar = bar;
	}
}

describe('Required', () => {

	describe('fixture setup', () => {
		it('should setup the fixture correctly', () => {
			expect(new Foo().bar)
					.toEqual(undefined);

			expect(new Foo("baz").bar)
					.toEqual("baz");
		});

	});

	describe('missing value', () => {
		const fixture = new Foo();

		it('should return error', () => {
			expect(new DecoratorValidator().validate(fixture).success)
					.toBe(false);

		});
	});

	describe('a given value', () => {
		const fixture = new Foo('bar');

		it('should return ok', () => {
			expect(new DecoratorValidator().validate(fixture).success)
					.toBe(true);

		});
	});

});
