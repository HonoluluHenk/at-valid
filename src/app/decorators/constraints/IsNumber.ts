import {isEmpty} from '../../util/isEmpty';
import {Opts, ValidationContext} from '../../validator/ValidationContext';
import {ValidatorNames} from '../../validator/ValidatorNames';

/**
 * The value must be of type number (NaN ist not allowed).
 */
export function IsNumber(
    opts?: Opts
): (target: object, propertyKey: string) => void {

    function isValid(value: any): boolean {
        return isEmpty(value) || typeof value === 'number' && !isNaN(value);
    }

    return (target: object, propertyKey: string) => {
        ValidationContext.instance.registerPropertyValidator({
            name: ValidatorNames.IsNumber,
            target,
            propertyKey,
            validatorFn: value => isValid(value),
            opts
        });
    };
}
