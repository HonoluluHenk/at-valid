import {isEmpty} from '../../util/isEmpty';
import {Opts, ValidationContext} from '../../validator/ValidationContext';
import {ValidatorNames} from '../../validator/ValidatorNames';

/**
 * The value must be equal (i.e.: ===) to the given value (any type supported).
 */
export function IsEqualTo(
    reference: any,
    opts?: Opts
): (target: object, propertyKey: string) => void {

    function isValid(value: any): boolean {

        return isEmpty(value) || value === reference;
    }

    return (target: object, propertyKey: string) => {
        ValidationContext.instance.registerPropertyValidator({
            name: ValidatorNames.IsEqualTo,
            target,
            propertyKey,
            messageArgs: {reference},
            validatorFn: value => isValid(value),
            opts
        });
    };
}
