import {ValidatorFnContext} from './ValidationContext';

export interface ValidationError {
    readonly validatorName: string;
    readonly propertyKey: string;
    readonly value: any;
    readonly path: string;
    readonly validatorFnContext: ValidatorFnContext;
    readonly childValidation?: ValidationResult;
}

export interface PropertyErrors {
    [property: string]: ValidationError;
}

export class ValidationResult {

    public get isSuccess(): boolean {
        return this.success;
    }

    public get isError(): boolean {
        return !this.success;
    }

    public static success(): ValidationResult {
        return new ValidationResult();
    }

    public static create(
        propertyErrors: PropertyErrors | undefined,
        classError?: ValidationError | undefined
    ): ValidationResult {
        return new ValidationResult(propertyErrors, classError);
    }

    public readonly propertyErrors: PropertyErrors;
    public readonly classError?: ValidationError;

    private readonly success: boolean;

    private constructor(
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

}

function hasProperties(obj: object): boolean {
    return Object.keys(obj).length > 0;
}
