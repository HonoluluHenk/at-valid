import {DEFAULT_GROUP, PropertyValidation, ValidationContext, ValidationFn} from "./ValidationContext";
import {ValidationResult} from "./ValidationResult";

export class Validator<T extends Object> {

	//FIXME: do not forget to clone the CustomContext before passing it to the validation function!
	validate(object: T, group: string = DEFAULT_GROUP): ValidationResult {
		let all = ValidationContext.instance.getValidationsForClass(object);
		// console.debug('all', all, typeof object);
		let groupValidations = all.filter(entry => this.isInGroup(entry.group, group));

		// console.debug('groupValidations: ', groupValidations);

		function reducer(acc: any, curr: Required<PropertyValidation<any>>) {
			const existing = acc[curr.propertyKey] || [];

			const extended = existing.concat(curr);
			acc[curr.propertyKey] = extended;

			return acc;
		}

		let byProperty = groupValidations
				.reduce((acc, curr) => reducer(acc, curr), {} as any);
		// console.debug('byproperty: ', byProperty);

		for (let objectKey in object) {
			// console.debug("!!!!!! validation of prop: ", objectKey);
			const validators: Required<PropertyValidation<any>>[] = byProperty[objectKey];

			console.debug("found validators: ", validators);

			if (!validators) {
				continue;
			}

			for (const validator of validators) {
				//FIXME: async
				console.log('ty[e', typeof validator.validationFn);
				const ok = validator.validationFn(object[objectKey] as any, object, validator.context);
				console.debug('func result:', ok);

				if (!ok) {
					return new ValidationResult(false);
				}
			}

		}

		console.debug('ok');
		return new ValidationResult(true);


	}

	private isInGroup(actualGroup: string | string[], wantedGroup: string) {
		if (typeof actualGroup === 'string') {
			return actualGroup === wantedGroup;
		}

		return actualGroup.indexOf(wantedGroup) >= 0;
	}

}