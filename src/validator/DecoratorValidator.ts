//FIXME: remove this tslint:disable
/* tslint:disable:no-console */
import {DEFAULT_GROUP, RuntimePropertyValidator, ValidationContext} from "./ValidationContext";
import {ValidationResult} from "./ValidationResult";

class ValidationResultBuilder {
	public readonly children:  {[key: string]: ValidationResultBuilder} = {};


	public addChild(property: string, child: ValidationResultBuilder): void {
		this.children[property] = child;
	}

}

export class DecoratorValidator<T extends object> {

	/**
	 * Execution ordering:
	 * for each Property: all validators of the first group are executed in order,
	 * then all validators of the second group... and so on.
	 * After all properties are processed and no error occured, class validators are executed in the same manner.
	 *
	 * @param targetInstance the object instance to execute the validations on.
	 * @param groups
	 */
	//FIXME: do not forget to clone the CustomContext before passing it to the validation function!
	public validate(targetInstance: T, groups: string[] = [DEFAULT_GROUP]): ValidationResult {
		const allValidators = ValidationContext.instance.getValidatorsForClass(targetInstance);
		// console.debug('allValidators: ', allValidators);

		// tslint:disable-next-line:forin
		for (const property in allValidators) {
			// console.debug("!!!!!! validation of prop: ", property);
			const propertyValidators: RuntimePropertyValidator[] = allValidators[property];

			// console.debug("found propertyValidators: ", propertyValidators);
			if (!propertyValidators) {
				continue;
			}

			for (const group of groups) {
				const result = this.validatePropertyInGroup(property, group, targetInstance, propertyValidators);

				//FIXME: hier gehts weiter
			}
		}

		//TODO: implement class validators

		console.debug('ok');

		return new ValidationResult(true);

	}

	private validatePropertyInGroup(
			property: string | symbol,
			group: string,
			targetInstance: T,
			validators: RuntimePropertyValidator[]
	) {
		for (const validator of validators) {
			if (validator.groups.indexOf(group) < 0) {
				continue;
			}

			//FIXME: async
			console.log('type', typeof validator.validatorFn);
			const propValue: any = (targetInstance as any)[property];
			const ok = validator.validatorFn(propValue as any, targetInstance, validator.customContext);
			console.debug('func result:', ok);

			if (!ok) {
				return new ValidationResult(false);
			}
		}

		return new ValidationResult(true);
	}
}
