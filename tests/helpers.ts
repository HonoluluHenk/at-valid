// import CustomMatcherFactories = jasmine.CustomMatcherFactories;
// import CustomMatcherResult = jasmine.CustomMatcherResult;
// import {isValidationError, ValidationError, ValidationResult} from '../src/validator/ValidationResult';
//
// // tslint:disable-next-line:no-namespace
// declare namespace jasmine {
// 	export interface Matchers<T> {
// 		toBeValidator(expected: object): void;
// 	}
// }
//
// const customMatchers: CustomMatcherFactories = {
// 	toBeValidator: (util, customEqualityTesters) => {
// 		return {
// 			compare: (actual: any, expected: any) => {
// 				const pass = true;
// 				const message = pass ? "passed" : "fail";
// 				const result: CustomMatcherResult = {
// 					pass,
// 					message
// 				};
//
// 				return result;
// 			}
// 		}
// 	}
// };
//
// function deepEquals(a: any, b: any ): boolean {
// 	return JSON.stringify(a) === JSON.stringify(b);
// }
//
// beforeAll(() => {
// 	// jasmine.addMatchers(customMatchers);
// 	jasmine.addCustomEqualityTester((first, second) => {
// 		if (!isValidationError(first)) {
// 			return undefined;
// 		}
//
// 		if (!isValidationError(second)) {
// 			throw new Error('first is a  ValidationError but second is not?');
// 		}
//
// 		return first.targetName === second.targetName &&
// 				first.validatorName === second.validatorName &&
// 				first.path === second.path &&
// 				deepEquals(first.validatorFnContext, second.validatorFnContext) &&
// 				first.message === second.message;
// 	});
// });
