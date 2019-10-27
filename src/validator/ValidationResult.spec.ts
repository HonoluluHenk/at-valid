import {PropertyErrors, ValidationError, ValidationResult} from './ValidationResult';

describe('ValidationResult', () => {

	describe('isSuccess/isError', () => {
		const params = [
			// no errors
			{propertyErrors: undefined, classErrors: undefined, success: true},
			// empty propertyErrors
			{propertyErrors: {}, classErrors: undefined, success: true},
			// propertyErrors with actual errors
			{propertyErrors: {foo: {} as ValidationError}, classErrors: undefined, success: false},
			// classErrors
			{propertyErrors: undefined, classErrors: {} as ValidationError, success: false},
			// both
			{propertyErrors: {foo: {} as ValidationError}, classErrors: {} as ValidationError, success: false},
		];

		params.forEach((param, idx) => {
			it(`should set isSuccess/isError accordingly (#${idx})`, () => {
				const actual = new ValidationResult(param.propertyErrors as PropertyErrors, param.classErrors);
				expect(actual.isSuccess)
						.withContext("isSuccess")
						.toEqual(param.success);
				expect(actual.isError)
						.withContext("isError")
						.toEqual(!param.success);
			});
		});
	});
});

