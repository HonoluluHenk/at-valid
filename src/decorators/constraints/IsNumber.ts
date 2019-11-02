import {isEmpty} from '../../util/isEmpty';
import {Opts, ValidationContext} from '../../validator/ValidationContext';
import {ValidatorNames} from '../ValidatorNames';

export function IsNumber(opts?: Opts): any {
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
