import {isEmpty} from "../../util/isEmpty";
import {Opts, ValidationContext} from "../../validator/ValidationContext";
import {ValidatorNames} from "../ValidatorNames";

export function IsBoolean(opts?: Opts): any {
	function isValid(value: any): boolean {
		return isEmpty(value) || typeof value === 'boolean';
	}

	return (target: object, propertyKey: string) => {
		ValidationContext.instance.registerPropertyValidator({
			name: ValidatorNames.IsBoolean,
			target,
			propertyKey,
			validatorFn: (value) => isValid(value),
			opts
		});
	};
}