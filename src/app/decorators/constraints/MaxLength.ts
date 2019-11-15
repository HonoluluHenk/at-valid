import {isEmpty} from '../../util/isEmpty';
import {Opts, ValidationContext} from '../../validator/ValidationContext';
import {ValidatorNames} from '../../validator/ValidatorNames';

/**
 * Enforce an upper bound of entries for arrays or string-length.
 * Supports any object that has a numeric &quot;length&quot; property.
 */
export function MaxLength(
    max: number,
    opts?: Opts
): (target: object, propertyKey: string) => void {

    function checkRange(value: any): boolean {
        return value.length <= max;
    }

    function validType(value: any): boolean {
        return typeof value.length === 'number';
    }

    function isValid(value: any): boolean {
        return isEmpty(value) || (validType(value) && checkRange(value));
    }

    return (target: object, propertyKey: string) => {
        ValidationContext.instance.registerPropertyValidator({
            name: ValidatorNames.MaxLength,
            messageArgs: {max},
            target,
            propertyKey,
            validatorFn: value => isValid(value),
            opts
        });
    };
}
