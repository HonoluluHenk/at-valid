import {isEmpty} from "../../util/isEmpty";
import {Opts, ValidationContext} from "../../validator/ValidationContext";
import {ValidatorNames} from "../ValidatorNames";

export function Min(min: number, inclusive: boolean = true, opts?: Opts) {
		function checkRange(value: number): boolean {
			if (inclusive) {
				return value >= min;
			} else {
				return value > min
			}
		}

		function validType(value: any): value is number {
			return typeof value === 'number';
		}

		function isValid(value: any): boolean {
			return isEmpty(value) || (validType(value) && checkRange(value));
		}

		return (target: object, propertyKey: string) => {
			ValidationContext.instance.registerPropertyValidator({
				name: ValidatorNames.Min,
				messageArgs: {min, inclusive},
				target,
				propertyKey,
				validatorFn: (value) => isValid(value),
				opts
			});
		};

}