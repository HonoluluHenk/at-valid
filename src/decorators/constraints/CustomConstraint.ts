import {Opts, ValidationContext, ValidatorFn} from "../../validator/ValidationContext";

export function CustomConstraint(name: string, validatorFn: ValidatorFn<any>, messageArgs?: object, opts?: Opts): any {
	return (target: object, propertyKey: string) => {
		ValidationContext.instance.registerPropertyValidator({
			name,
			target,
			propertyKey,
			messageArgs,
			validatorFn,
			opts
		});
	};
}
