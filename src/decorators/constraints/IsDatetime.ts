import {isEmpty} from "../../util/isEmpty";
import {Opts, ValidationContext} from "../../validator/ValidationContext";
import {ValidatorNames} from "../ValidatorNames";

export function IsDatetime(opts?: Opts): any {
	function isValid(value: any): boolean {
		return isEmpty(value) || value instanceof Date;
	}

	return (target: object, propertyKey: string) => {
		ValidationContext.instance.registerPropertyValidator({
			name: ValidatorNames.IsDatetime,
			target,
			propertyKey,
			validatorFn: (value) => isValid(value),
			opts
		});
	};
}
