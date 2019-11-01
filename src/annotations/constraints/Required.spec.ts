import {DecoratorValidator} from "../../validator/DecoratorValidator";
import {ValidationResult} from "../../validator/ValidationResult";
import {Required} from "./Required";

/**
 * If you copied this test, please note: most tests should use the {@link testBuilder}.
 * We cannot use it here because this is the only validator that has null/undefined as invalid values.
 */
describe('Required', () => {
	class TestClassWithContext {
		@Required({customContext: {should: "propagate to error"}})
		public bar?: any | null | undefined;

		constructor(bar: any | null | undefined) {
			this.bar = bar;
		}
	}

	describe('any given value', () => {
		const params = [
			{input: ""},
			{input: "Hello World"},
			{input: 0},
			{input: -0},
			{input: 1},
			{input: NaN},
			{input: []},
			{input: {}},
			{input: new Date()}
		];

		params.forEach(param => {
			it(`(${param.input}) should succeed`, async () => {
				const fixture = new TestClassWithContext(param.input);

				const actual = await new DecoratorValidator().validate(fixture);

				expect(actual.isSuccess)
						.toBe(true);

			});
		});
	});

	describe('missing values', () => {
		const params = [
			{input: undefined},
			{input: null}
		];

		params.forEach(param => {
			it(`(${param.input}) should return error`, async () => {
				const fixture = new TestClassWithContext(param.input);

				const actual = await new DecoratorValidator()
						.validate(fixture);

				expect(actual.isSuccess)
						.toBe(false);

			});

			it(`should have the desired error message (${param.input})`, async () => {
				const actual = await new DecoratorValidator().validate(new TestClassWithContext(param.input));

				expect(actual)
						.toEqual(ValidationResult.create({
							bar: {
								validatorName: 'Required',
								propertyKey: 'bar',
								value: param.input,
								path: '$.bar',
								validatorFnContext: {
									args: {},
									customContext: {should: "propagate to error"}
								}
							}
						}, undefined));
			});
		});
	});
});
