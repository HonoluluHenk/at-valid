import {isEmpty} from "../util/isEmpty";
import {requireType} from "../util/requireType";
import {CustomContext, ValidationContext} from "../validator/ValidationContext";

export const MAX_LENGTH_NAME = "MaxLength";

export function MaxLength(max: number, context?: CustomContext): any {

	function checkRange(value: string): boolean {
		return value.length <= max;
	}

	return (target: object, propertyKey: string) => {
		ValidationContext.instance.registerPropertyValidator({
			name: MAX_LENGTH_NAME,
			messageArgs: {max},
			target,
			propertyKey,
			validatorFn: (value) => isEmpty(value) || checkRange(requireType(value, 'string')),
			context
		});
	};
}
