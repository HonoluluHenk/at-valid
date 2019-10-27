import {ValidatorFnContext} from './ValidationContext';

export interface ValidationError {
	readonly validatorName: string
	readonly propertyKey: string,
	readonly path: string,
	readonly validatorFnContext?: ValidatorFnContext,
}

export interface PropertyErrors {
	[key: string]: ValidationError
}

export class ValidationResult {
	public readonly propertyErrors: PropertyErrors;
	public readonly classError?: ValidationError;

	private readonly success: boolean;

	constructor(
			propertyErrors?: PropertyErrors,
			classError?: ValidationError
	) {
		this.propertyErrors = {
			...propertyErrors
		};
		this.classError = classError;

		const failure = (this.propertyErrors && hasProperties(this.propertyErrors))
				|| this.classError;
		this.success = !failure;
	}

	public get isSuccess(): boolean {
		return this.success;
	}

	public get isError(): boolean {
		return !this.success;
	}

}

function hasProperties(obj: object): boolean {
	return Object.keys(obj).length > 0;
}
