import {isEmpty} from '../../util/isEmpty';
import {Opts, ValidationContext} from '../../validator/ValidationContext';
import {ValidatorNames} from '../ValidatorNames';

export function Max(max: number, inclusive: boolean = true, opts?: Opts) {
    function checkRange(value: number): boolean {
        if (inclusive) {
            return value <= max;
        } else {
            return value < max;
        }
    }

    function validType(value: any): value is number {
        return typeof value === 'number';
    }

    function isValid(value: any): boolean {
        return isEmpty(value) || (validType(value) && checkRange(value));
    }

    return (target: object, propertyKey: string) => {
        ValidationContext.instance.registerPropertyValidator({
            name: ValidatorNames.Max,
            messageArgs: {max, inclusive},
            target,
            propertyKey,
            validatorFn: value => isValid(value),
            opts
        });
    };

}
