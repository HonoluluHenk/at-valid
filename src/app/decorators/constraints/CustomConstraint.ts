import {Opts, ValidationContext, ValidatorFn} from '../../validator/ValidationContext';

/**
 * Easily define constraint decorators (primary use: one-off constraints).
 * @param name The name of the constraint, this gets passed to the validatorName property in the error message.
 * @param validatorFn Your validation function.
 * @param messageArgs Any custom object you want to get passed to the error message.
 * @param opts Standard at-validator options.
 */
export function CustomConstraint(
    name: string,
    validatorFn: ValidatorFn<any>,
    messageArgs?: object,
    opts?: Opts
): (target: object, propertyKey: string) => void {

    return (target: object, propertyKey: string) => {
        ValidationContext.instance.registerPropertyValidator({
            name,
            target,
            propertyKey,
            messageArgs,
            validatorFn,
            opts
        });
    };
}
