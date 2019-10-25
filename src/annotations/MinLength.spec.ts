import {DecoratorValidator} from "../validator/DecoratorValidator";
import {MinLength} from "./MinLength";

describe('MinLength', () => {
	class Foo {
		@MinLength(5)
		public bar?: string;

		constructor(
				bar?: string
		) {
			this.bar = bar;
		}
	}

	describe('empty values', () => {
		const fixture = new Foo();

		it('should be ok', () => {
			expect(new DecoratorValidator().validate(fixture).isSuccess)
					.toBe(true);
		});
	});

	describe('wrong types', () => {
		const fixture = new Foo(5 as any as string);

		it('should throw', () => {
			expect(() => new DecoratorValidator().validate(fixture))
					.toThrowError("invalid type: number, required type: string");
		});
	});

	describe('long enough strings', () => {
		const fixture = new Foo("Hello World");

		it('should be ok', () => {
			expect(new DecoratorValidator().validate(fixture).isSuccess)
					.toBe(true);
		})
	});

	describe('too short strings', () => {
		const fixture = new Foo("bleh");

		it('should fail', () => {
			expect(new DecoratorValidator().validate(fixture).isSuccess)
					.toBe(false);
		})
	});

});
