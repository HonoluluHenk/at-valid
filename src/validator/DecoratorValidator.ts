//FIXME: remove this tslint:disable
/* tslint:disable:no-console */
import {DEFAULT_GROUP, RuntimeValidatorConfig, ValidationContext} from "./ValidationContext";
import {ValidationResult} from "./ValidationResult";

export class DecoratorValidator<T extends object> {

	/**
	 * Execution ordering:
	 * iterate over groups
	 * for each group: iterate over targetInstance properties
	 * for each property inside group: execute each validator
	 * for current group: if not property validation occured: execute each class-validator
	 *
	 * @param targetInstance the object instance to execute the validations on.
	 * @param groups
	 */
	public validate(targetInstance: T, groups: string[] = [DEFAULT_GROUP]): ValidationResult {
		const allValidators = ValidationContext.instance.getValidatorsForClass(targetInstance);
		// console.debug('allValidators: ', allValidators);

		for (const group of groups) {
			// tslint:disable-next-line:forin
			for (const property in allValidators) {
				// console.debug("!!!!!! validation of prop: ", property);
				const propertyValidators: RuntimeValidatorConfig[] = allValidators[property];

				// console.debug("found propertyValidators: ", propertyValidators);
				if (!propertyValidators) {
					continue;
				}

				const result = this.validatePropertyInGroup(property, group, targetInstance, propertyValidators);
				// console.debug('result: ', result);
				if (result.error) {
					return result;
				}
			}

			//TODO: implement class validators
		}

		// console.debug('ok');
		return new ValidationResult();
	}

	private validatePropertyInGroup(
			property: string,
			group: string,
			targetInstance: T,
			validators: RuntimeValidatorConfig[]
	) {
		for (const validator of validators) {
			if (validator.groups.indexOf(group) < 0) {
				continue;
			}

			//FIXME: async
			// console.log('type', typeof validator.validatorFn);
			const propValue: any = (targetInstance as any)[property];
			const clonedFnContext = validator.cloneValidatorCnContext();
			const ok = validator.validatorFn(propValue, clonedFnContext, targetInstance);
			// console.debug('func result:', ok);

			if (!ok) {
				return new ValidationResult({validatorFnContext: clonedFnContext});
			}
		}

		return new ValidationResult();
	}
}
