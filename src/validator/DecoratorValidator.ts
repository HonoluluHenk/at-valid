import {distinct} from '../util/filters/distinct';
import {toObject} from '../util/reducers/toObject';
import {DEFAULT_GROUP, PropertyValidator, ValidationContext, ValidatorFnContext} from "./ValidationContext";
import {ValidationError, ValidationResult} from "./ValidationResult";

const PATH_SEPARATOR = '.';

export interface ValidateParams {
	groups?: string[];
}

export interface GroupPlan {
	targetInstance: object,
	propertyValidators: {
		[property: string]: PropertyValidator[]
	}
}

export interface ExecutionPlan {
	groups: {
		[group: string]: GroupPlan
	}
}

export class DecoratorValidator<T extends object> {

	/**
	 * Execution ordering:
	 * iterate over groups
	 * for each group: iterate over targetInstance propertyValidators
	 * for each property inside group: execute each validator
	 * for current group: if no property validation error occured: execute each class-validator
	 *
	 * @param targetInstance the object instance to execute the validations on.
	 * @param params Configure validation behavior
	 */
	public async validate(targetInstance: T, params?: ValidateParams): Promise<ValidationResult> {
		const groupPlans = this.buildExecutionPlan(targetInstance, params);

		for (const group of Object.keys(groupPlans.groups)) {
			const groupPlan = groupPlans.groups[group];
			const validatorPromises: Array<Promise<ValidationError | undefined>> = Object.keys(groupPlan.propertyValidators)
					.map(propertyKey => runValidators(groupPlan.targetInstance, groupPlan.propertyValidators[propertyKey]));

			const validationResult = await Promise.all(validatorPromises)
					.then(groupResults => groupResults.filter(x => !!x) as ValidationError[])
					.then((groupResults: ValidationError[]) =>
							ValidationResult.create(groupResults.reduce(toObject(x => x!.propertyKey), {}), undefined)
					);

			if (validationResult.isError) {
				return Promise.resolve(validationResult);
			}
		}

		return Promise.resolve(ValidationResult.success());
	}

	public buildExecutionPlan(targetInstance: T, params?: ValidateParams): ExecutionPlan {
		const parsedParams: Required<ValidateParams> = {
			groups: (params || {}).groups || [DEFAULT_GROUP]
		};

		const result: ExecutionPlan = {
			groups: {}
		};

		const executed: { [property: string]: PropertyValidator[] } = {};

		const validatorsByProperty = ValidationContext.instance.getValidatorsForClass(targetInstance);
		// console.debug('validatorsByProperty: ', validatorsByProperty);

		for (const group of parsedParams.groups) {
			const groupPlan: GroupPlan = {
				targetInstance,
				propertyValidators: {}
			};

			for (const propertyKey of Object.keys(validatorsByProperty)) {
				executed[propertyKey] = executed[propertyKey] || [];

				// console.debug("!!!!!! validation of prop: ", propertyKey);
				const validators: PropertyValidator[] = validatorsByProperty[propertyKey]
						.filter(validator => validatorInGroup(validator, group))
						.filter(validator => executed[propertyKey].indexOf(validator) < 0)
						.filter(distinct());

				executed[propertyKey].push(...validators);

				groupPlan.propertyValidators[propertyKey] = validators;
			}

			result.groups[group] = groupPlan;
			//TODO: implement class validators
		}

		// console.debug('ok');
		return result;
	}
}

function validatorInGroup(validator: PropertyValidator, group: string): boolean {
	return validator.groups.indexOf(group) >= 0;
}

function mapToValidationError(ok: boolean, rvc: PropertyValidator,
							  validatorFnContext: ValidatorFnContext
): ValidationError | undefined {
	if (ok) {
		return undefined;
	}

	//FIXME:
	const parentPath = "";

	const path = [parentPath, rvc.propertyKey]
			.filter(e => !!e)
			.join(PATH_SEPARATOR);

	return {
		propertyKey: rvc.propertyKey,
		path,
		validatorName: rvc.name,
		validatorFnContext
	};
}

async function execute(targetInstance: object, rvc: PropertyValidator): Promise<ValidationError | undefined> {

	const validatorFnContext = rvc.cloneValidatorFnContext();

	let validationResult;
	switch (rvc.validatorFn) {
		case "NESTED":
			validationResult = true;
			validationResult = (rvc as any).validatorFn((targetInstance as any)[rvc.propertyKey], validatorFnContext, targetInstance);
			break;
		default:
			validationResult = rvc.validatorFn((targetInstance as any)[rvc.propertyKey], validatorFnContext, targetInstance);
			break;
	}

	let promise: Promise<boolean>;

	if (typeof validationResult === 'boolean') {
		promise = Promise.resolve(validationResult);
	} else if (validationResult instanceof Promise) {
		promise = validationResult;
	} else {
		throw Error("unsupported validator function result: " + typeof validationResult + ", value: " + JSON.stringify(validationResult));
	}

	return promise
			.then(ok => mapToValidationError(ok, rvc, validatorFnContext));

}

async function runValidators(targetInstance: object,
							 validators: PropertyValidator[]): Promise<ValidationError | undefined> {
	for (const rcv of validators.values()) {
		const err = await execute(targetInstance, rcv);
		if (err) {
			return Promise.resolve(err);
		}
	}

	return Promise.resolve(undefined);
}

