import {isEmpty} from '../../util/isEmpty';
import {Opts, ValidationContext} from '../../validator/ValidationContext';
import {ValidatorNames} from '../ValidatorNames';

export function IsIn(
    allowedValues: object | any[],
    opts?: Opts
): (target: object, propertyKey: string) => void {

    function isValid(value: any): boolean {
        return isEmpty(value)
            || value in allowedValues;
    }

    return (target: object, propertyKey: string) => {
        ValidationContext.instance.registerPropertyValidator({
            name: ValidatorNames.IsIn,
            messageArgs: {allowedValues},
            target,
            propertyKey,
            validatorFn: value => isValid(value),
            opts
        });
    };
}
