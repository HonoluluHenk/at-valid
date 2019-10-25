import {ValidatorFnContext} from './ValidationContext';

export class ValidationResult {
	constructor(
			public readonly error? : {
				readonly validatorFnContext?: ValidatorFnContext,
			}
	) {
	}

	public get isSuccess(): boolean {
		return !this.error;
	}

	public get isError(): boolean {
		return !!this.error;
	}

}