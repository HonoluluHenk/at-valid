import {isEmpty} from "../../util/isEmpty";
import {Opts, ValidationContext} from "../../validator/ValidationContext";
import {ValidatorNames} from "../ValidatorNames";

export function Matches(pattern: string | RegExp, messageArgs?: object, opts?: Opts): any {
	function matches(value: string): boolean {
		const match = value.match(pattern);

		return match !== null && match.length > 0;
	}

	function isValid(value: any): boolean {
		return isEmpty(value) || (typeof value === "string" && matches(value));
	}

	return (target: object, propertyKey: string) => {
		ValidationContext.instance.registerPropertyValidator({
			name: ValidatorNames.Matches,
			messageArgs: messageArgs ? messageArgs : {pattern},
			target,
			propertyKey,
			validatorFn: (value) => isValid(value),
			opts
		});
	};
}
