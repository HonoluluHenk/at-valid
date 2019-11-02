import {isEmpty} from "../../util/isEmpty";
import {Opts, ValidationContext} from "../../validator/ValidationContext";
import {ValidatorNames} from "../ValidatorNames";

/**
 * The value must be an array, see {@link Array#isArray}.
 */
export function IsArray(opts?: Opts): any {
	return (target: object, propertyKey: string) => {
		ValidationContext.instance.registerPropertyValidator({
			name: ValidatorNames.IsArray,
			target,
			propertyKey,
			validatorFn: value => isEmpty(value) || Array.isArray(value),
			opts
		});
	};
}
