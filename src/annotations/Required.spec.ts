import {DecoratorValidator} from "../validator/DecoratorValidator";
import {Required} from "./Required";

// @Foobar('class')
class Foo {
	@Required()
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
			it(`(${param.input}) should return error`, () => {
				const fixture = new Foo(param.input);

				const actual = new DecoratorValidator()
						.validate(fixture)
						.isSuccess;

				expect(actual)
						.toBe(false);

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
			it(`(${param.input}) should succeed`, () => {
				const fixture = new Foo(param.input);

				const actual = new DecoratorValidator()
						.validate(fixture)
						.isSuccess;

				expect(actual)
						.toBe(true);

			});
		});
	});

});
