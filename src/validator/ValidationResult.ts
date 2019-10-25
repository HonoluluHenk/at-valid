export class ValidationError {
	public readonly foobar: string = "ignore";
}

export class ValidationResult {
	constructor(
			public readonly validationError?: ValidationError
	) {
	}

	public get success(): boolean {
		return !this.validationError;
	}

	public get error(): boolean {
		return !!this.validationError;
	}

}