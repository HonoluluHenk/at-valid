import {DecoratorValidator} from "../validator/DecoratorValidator";
import {IsNotEmpty} from "./IsNotEmpty";

// @Foobar('class')
class Foo {
	@IsNotEmpty()
	public bar?: string;

	constructor(bar?: string) {
		this.bar = bar;
	}
}

describe('IsNotEmpty', () => {

	describe('fixture setup', () => {
		it('should setup the fixture correctly', () => {
			expect(new Foo().bar)
					.toEqual(undefined);

			expect(new Foo("baz").bar)
					.toEqual("baz");
		});

	});

	describe('asdf', () => {
		it('should do stuff', () => {

			expect(new DecoratorValidator().validate(new Foo()).success)
					.toBeFalsy();

		});
	});

});
