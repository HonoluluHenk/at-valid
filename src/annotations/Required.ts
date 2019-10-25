import {isEmpty} from "../util/isEmpty";
import {CustomContext, ValidationContext} from "../validator/ValidationContext";

export const REQIRED_NAME = "Required";

/**
 * The inverse of <a href="https://validatejs.org/#utilities-is-empty">validate.js docs for isEmpty</a>.
 */
export function Required(context?: CustomContext): any {
	return (target: object, propertyKey: string) => {
		ValidationContext.instance.registerPropertyValidator({
			name: REQIRED_NAME,
			target,
			propertyKey,
			validatorFn: value => !isEmpty(value),
			context
		});
	};
}
