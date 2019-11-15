import {isEmpty} from '../../util/isEmpty';
import {Opts, ValidationContext} from '../../validator/ValidationContext';
import {ValidatorNames} from '../../validator/ValidatorNames';

/**
 * The value must not be null or undefined.
 */
export function Required(
    opts?: Opts
): (target: object, propertyKey: string) => void {

    return (target: object, propertyKey: string) => {
        ValidationContext.instance.registerPropertyValidator({
            name: ValidatorNames.Required,
            target,
            propertyKey,
            validatorFn: value => !isEmpty(value),
            opts
        });
    };
}
