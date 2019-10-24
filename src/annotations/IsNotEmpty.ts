import * as validate from 'validate.js';
import {CustomContext, ValidationContext} from "../validator/ValidationContext";

export const IS_NOT_EMPTY = "IsNotEmpty";

export function IsNotEmpty(context?: CustomContext): any {
	return (target: object, propertyKey: string | symbol) => {
		ValidationContext.instance.registerPropertyValidator({
			name: IS_NOT_EMPTY,
			target,
			propertyKey: propertyKey as string, // FIXME: symbol?
			validatorFn: value => !validate.isEmpty(value),
			context
		});
	};
}
