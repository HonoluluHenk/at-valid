import {DecoratorValidator} from "../src/validator/DecoratorValidator";
import {CustomContext} from "../src/validator/ValidationContext";
import {ValidationResult} from "../src/validator/ValidationResult";

interface TestBuilder<T extends object> {
	readonly validatorName: string;
	readonly propertyKey: string;
	readonly ctor: new (value: any) => T;
	readonly build: (valids: any[], invalids: any[]) => TestBuilder<T>;
	readonly buildWithContext: (customContext: CustomContext, valids: any[], invalids: any[]) => TestBuilder<T>;
}

/**
 * Build describe/it blocks used by an estimated 99% of all validators.
 */
export function testBuilder<T extends object>(
		validatorName: string,
		propertyKey: string,
		ctor: new (value: any) => T,
		expectedArgs?: object
): TestBuilder<T> {

	const builder = {
		validatorName,
		propertyKey,
		ctor,
		build: (valids: T[], invalids: T[]) => {
			build(validatorName, propertyKey, ctor, valids, invalids, expectedArgs, undefined);

			return builder;
		},
		buildWithContext: (customContext: CustomContext, valids: T[], invalids: T[]) => {
			build(validatorName, propertyKey, ctor, valids, invalids, expectedArgs, customContext);

			return builder;
		}
	};

	return builder;
}

function build<T extends object>(
		validatorName: string,
		propertyKey: string,
		ctor: new (value: any) => T,
		valids: T[],
		invalids: T[],
		args: object | undefined,
		customContext: object | undefined,
): void {

	describe('an empty value', () => {
		const params = [
			{fixture: new ctor(undefined)},
			{fixture: new ctor(null)},
		];

		params.forEach(param => {
			it(`should succeed: ${JSON.stringify(param.fixture)}`, async () => {
				const actual = await new DecoratorValidator().validate(param.fixture);

				expect(actual.isSuccess)
						.toBe(true);
			});
		});
	});

	describe('valid values', () => {
		valids.forEach(fixture => {
			it(`should succeed: ${JSON.stringify(fixture)}`, async () => {
				const actual = await new DecoratorValidator().validate(fixture);

				expect(actual.isSuccess)
						.toEqual(true);
			});
		});
	});

	describe('invalid values', () => {
		invalids.forEach(value => {
			it(`should fail: ${JSON.stringify(value)}`, async () => {
				const fixture = new ctor(value);

				const actual = await new DecoratorValidator().validate(fixture);
				expect(actual)
						.toEqual(ValidationResult.create({
							[propertyKey]: {
								validatorName,
								propertyKey,
								path: "$." + propertyKey,
								value,
								validatorFnContext: {args: (args || {}), customContext: customContext || {}}
							}
						}));
			});
		})
	})

}
