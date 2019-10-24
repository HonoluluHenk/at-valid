import {CustomContext, ValidationContext} from "../validator/ValidationContext";
import * as validate from 'validate.js';

export const IS_NOT_EMPTY = "IsNotEmpty";

export function IsNotEmpty(context?: CustomContext): any {
	return function (target: Object, propertyKey: string | symbol) {
		ValidationContext.instance.registerPropertyValidation({
			name: IS_NOT_EMPTY,
			target: target,
			propertyKey: propertyKey as string, // FIXME: symbol?
			validationFn: value => !validate.isEmpty(value),
			context: context
		});
	};
}
