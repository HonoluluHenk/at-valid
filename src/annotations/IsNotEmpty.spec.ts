import {IsNotEmpty} from "./IsNotEmpty";
import {ValidationContext} from "../validator/ValidationContext";
import {Validator} from "../validator/Validator";

// @Foobar('class')
class Foo {
	@IsNotEmpty()
	bar?: string;

	constructor(bar?: string) {
		this.bar = bar;
	}
}

fdescribe('IsNotEmpty', () => {

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

			expect(new Validator().validate(new Foo()).success)
					.toBeFalsy();

		});
	});

});
