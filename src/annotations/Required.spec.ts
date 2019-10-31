import {DecoratorValidator} from "../validator/DecoratorValidator";
import {Required} from "./Required";

class Foo {
	@Required({customContext: {should: "propagate to error"}})
	public bar?: any | null | undefined;

	constructor(bar: any | null | undefined) {
		this.bar = bar;
	}
}

describe('Required', () => {

	describe('missing values', () => {
		const params = [
			{input: undefined},
			{input: null}
		];

		params.forEach(param => {
			it(`(${param.input}) should return error`, async () => {
				const fixture = new Foo(param.input);

				const actual = await new DecoratorValidator()
						.validate(fixture);

				expect(actual.isSuccess)
						.toBe(false);

			});

			it(`should have the desired error message (${param.input})`, async () => {
				const actual = await new DecoratorValidator().validate(new Foo(param.input));

				expect(actual.propertyErrors)
						.toEqual({
							bar: {
								validatorName: 'Required',
								propertyKey: 'bar',
								path: '$.bar',
								validatorFnContext: {
									args: {},
									customContext: {should: "propagate to error"}
								}
							}
						});
			});
		});
	});

	describe('a given value', () => {
		const params = [
			{input: ""},
			{input: "Hello World"},
			{input: 0},
			{input: -0},
			{input: 1},
			{input: NaN},
			{input: []},
			{input: {}},
		];

		params.forEach(param => {
			it(`(${param.input}) should succeed`, async () => {
				const fixture = new Foo(param.input);

				const actual = await new DecoratorValidator()
						.validate(fixture);

				expect(actual.isSuccess)
						.toBe(true);

			});
		});
	});

});
