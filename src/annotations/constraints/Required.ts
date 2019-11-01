import {isEmpty} from "../../util/isEmpty";
import {Opts, ValidationContext} from "../../validator/ValidationContext";
import {ValidatorNames} from '../ValidatorNames';

/**
 * The inverse of <a href="https://validatejs.org/#utilities-is-empty">validate.js docs for isEmpty</a>.
 */
export function Required(opts?: Opts): any {
	return (target: object, propertyKey: string) => {
		ValidationContext.instance.registerPropertyValidator({
			name: ValidatorNames.Required,
			target,
			propertyKey,
			validatorFn: value => !isEmpty(value),
			opts
		});
	};
}
