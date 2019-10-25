import {CustomContext, ValidationContext} from "../validator/ValidationContext";
import {isEmpty} from "../util/isEmpty";
import {requireType} from "../util/requireType";

export const MIN_LENGTH = "MinLength";

export function MinLength(min: number, context?: CustomContext): any {

	function checkRange(value: string): boolean {
		return value.length >= min;
	}

	return (target: object, propertyKey: string) => {
		ValidationContext.instance.registerPropertyValidator({
			name: MIN_LENGTH,
			messageArgs: {min},
			target,
			propertyKey,
			validatorFn: (value) => isEmpty(value) || checkRange(requireType(value, 'string')),
			context
		});
	};
}

