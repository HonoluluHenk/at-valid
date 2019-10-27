import {DEFAULT_GROUP, RuntimeValidatorConfig, ValidationContext} from "./ValidationContext";
import {PropertyErrors, ValidationError, ValidationResult} from "./ValidationResult";

const PATH_SEPARATOR = '.';

export interface ValidateParams {
	groups?: string[];
}

export class DecoratorValidator<T extends object> {

	/**
	 * Execution ordering:
	 * iterate over groups
	 * for each group: iterate over targetInstance properties
	 * for each property inside group: execute each validator
	 * for current group: if not property validation occured: execute each class-validator
	 *
	 * @param targetInstance the object instance to execute the validations on.
	 * @param params Configure validation behavior
	 */
	public validate(targetInstance: T, params?: ValidateParams): Promise<ValidationResult> {
		const parsedParams: Required<ValidateParams> = {
			groups: (params || {}).groups || [DEFAULT_GROUP]
		};

		const validatorsByProperty = ValidationContext.instance.getValidatorsForClass(targetInstance);
		// console.debug('validatorsByProperty: ', validatorsByProperty);

		const propertyErrors: PropertyErrors = {};
		const executed: RuntimeValidatorConfig[] = [];

		for (const group of parsedParams.groups) {
			for (const propertyKey in validatorsByProperty) {
				if (!validatorsByProperty.hasOwnProperty(propertyKey)) {
					continue;
				}

				// console.debug("!!!!!! validation of prop: ", propertyKey);
				const validators: RuntimeValidatorConfig[] = validatorsByProperty[propertyKey]
						.filter(validator => validatorInGroup(validator, group))
						.filter(v => executed.indexOf(v) < 0);
				// console.debug("found validators for propertyKey: ", propertyKey, validators);

				const error = this.executePropertyValidators("", propertyKey, targetInstance, validators);
				executed.push(...validators);

				// console.debug('result: ', result);
				if (error) {
					propertyErrors[propertyKey] = error;
				}
			}

			if (Object.keys(propertyErrors).length !== 0) {
				break;
			}
			//TODO: implement class validators
		}

		// console.debug('ok');
		return Promise.resolve(new ValidationResult(propertyErrors, undefined));
	}

	private executePropertyValidators(
			parentPath: string,
			property: string,
			targetInstance: T,
			validators: RuntimeValidatorConfig[]
	): ValidationError | undefined {
		for (const validator of validators) {
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

function validatorInGroup(validator: RuntimeValidatorConfig, group: string): boolean {
	return validator.groups.indexOf(group) >= 0;
}