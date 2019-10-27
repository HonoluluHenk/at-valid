import {DecoratorValidator} from "../validator/DecoratorValidator";
import {MaxLength} from './MaxLength';

describe('MaxLength', () => {
	class Foo {
		@MaxLength(5, {customContext: {should: "propagate to error"}})
		public bar?: string | null;

		constructor(bar: string | null | undefined) {
			this.bar = bar;
		}
	}

	describe('wrong type', () => {
		const fixture = new Foo({} as string);

		it('should never validate', () => {
			expect(new DecoratorValidator().validate(fixture).isSuccess)
					.toEqual(false);
		});
	});

	describe('valid input', () => {
		const params = [
			{text: undefined},
			{text: null},
			{text: ""},
			{text: "12345"}
		];

		params.forEach(param => {
			it(`should succeed (${param.text})`, () => {
				expect(new DecoratorValidator().validate(new Foo(param.text)).isSuccess)
						.toBe(true);
			})
		});

	});

	describe('invalid input', () => {
		const params = [
			{text: "123456"},
			{text: "Hello World"},
		];

		params.forEach(param => {

			it(`should fail (${param.text})`, () => {
				const actual = new DecoratorValidator().validate(new Foo(param.text));

				expect(actual.isSuccess)
						.toEqual(false);
			});

			it(`should have the desired error message (${param.text})`, () => {
				const actual = new DecoratorValidator().validate(new Foo(param.text));

				expect(actual.propertyErrors)
						.toEqual({
							bar: {
								validatorName: 'MaxLength',
								propertyKey: 'bar',
								path: 'bar',
								validatorFnContext: {
									args: {max: 5},
									customContext: {should: "propagate to error"}
								}
							}
						});
			});
		});
	});
});
