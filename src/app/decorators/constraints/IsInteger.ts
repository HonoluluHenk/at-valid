import {isEmpty} from '../../util/isEmpty';
import {Opts, ValidationContext} from '../../validator/ValidationContext';
import {ValidatorNames} from '../../validator/ValidatorNames';

/**
 * Same as {@link IsNumber} with decimal places forbidden.
 */
export function IsInteger(
    opts?: Opts
): (target: object, propertyKey: string) => void {

    function isInteger(value: number): boolean {
        return value % 1 === 0;
    }

    function isValid(value: any): boolean {
        return isEmpty(value) || typeof value === 'number' && !isNaN(value) && isInteger(value);
    }

    return (target: object, propertyKey: string) => {
        ValidationContext.instance.registerPropertyValidator({
            name: ValidatorNames.IsInteger,
            target,
            propertyKey,
            validatorFn: value => isValid(value),
            opts
        });
    };
}
