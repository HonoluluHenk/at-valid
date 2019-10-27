import {DEFAULT_GROUP, RuntimeValidatorConfig, ValidationContext} from "./ValidationContext";
import {PropertyErrors, ValidationError, ValidationResult} from "./ValidationResult";

const PATH_SEPARATOR = '.';

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
		const validatorsByProperty = ValidationContext.instance.getValidatorsForClass(targetInstance);
		// console.debug('validatorsByProperty: ', validatorsByProperty);

		const propertyErrors: PropertyErrors = {};

		for (const group of groups) {
			// tslint:disable-next-line:forin
			for (const propertyKey in validatorsByProperty) {
				if (!validatorsByProperty.hasOwnProperty(propertyKey)) {
					continue;
				}

				// console.debug("!!!!!! validation of prop: ", propertyKey);
				const validators: RuntimeValidatorConfig[] = validatorsByProperty[propertyKey];

				// console.debug("found validators for propertyKey: ", propertyKey, validators);
				if (!validators) {
					continue;
				}

				const error = this.validatePropertyInGroup("", propertyKey, group, targetInstance, validators);
				// console.debug('result: ', result);
				if (error) {
					propertyErrors[propertyKey] = error;
				}
			}

			//TODO: implement class validators
		}

		// console.debug('ok');
		return new ValidationResult(propertyErrors, undefined);
	}

	private validatePropertyInGroup(
			parentPath: string,
			property: string,
			group: string,
			targetInstance: T,
			validators: RuntimeValidatorConfig[]
	): ValidationError | undefined {
		for (const validator of validators) {
			if (validator.groups.indexOf(group) < 0) {
				continue;
			}

			//FIXME: async
			// console.log('type', typeof validator.validatorFn);
			const propValue: any = (targetInstance as any)[property];
			const clonedFnContext = validator.cloneValidatorFnContext();
			const ok = validator.validatorFn(propValue, clonedFnContext, targetInstance);
			// console.debug('func result:', ok);

			const path = [parentPath, property]
					.filter(e => !!e)
					.join(PATH_SEPARATOR);

			if (!ok) {
				return {
					propertyKey: property,
					path,
					validatorName: validator.name,
					validatorFnContext: validator.validatorFnContext
				};
			}
		}

		return undefined;
	}
}
