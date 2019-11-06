import {hasProperties} from '../util/hasProperties';
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

/**
 * The root-level error-result object for one object.
 */
export class ValidationResult {

    get isSuccess(): boolean {
        return this.success;
    }

    get isError(): boolean {
        return !this.success;
    }

    static success(): ValidationResult {
        return new ValidationResult();
    }

    static create(
        propertyErrors: PropertyErrors | undefined,
        classError?: ValidationError
    ): ValidationResult {
        return new ValidationResult(propertyErrors, classError);
    }

    readonly propertyErrors: PropertyErrors;
    readonly classError?: ValidationError;

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
