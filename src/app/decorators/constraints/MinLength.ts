import {isEmpty} from '../../util/isEmpty';
import {Opts, ValidationContext} from '../../validator/ValidationContext';
import {ValidatorNames} from '../../validator/ValidatorNames';

/**
 * Enforce lower bound of entries for arrays or string-length.
 * Supports any object that has a numeric &quot;length&quot; property.
 */
export function MinLength(
    min: number = 1,
    opts?: Opts
): (target: object, propertyKey: string) => void {

    function checkRange(value: any): boolean {
        return value.length >= min;
    }

    function validType(value: any): boolean {
        return typeof value.length === 'number';
    }

    function isValid(value: any): boolean {
        return isEmpty(value) || (validType(value) && checkRange(value));
    }

    return (target: object, propertyKey: string) => {
        ValidationContext.instance.registerPropertyValidator({
            name: ValidatorNames.MinLength,
            messageArgs: {min},
            target,
            propertyKey,
            validatorFn: value => isValid(value),
            opts
        });
    };
}
