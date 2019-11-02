import {isEmpty} from '../../util/isEmpty';
import {Opts, ValidationContext} from '../../validator/ValidationContext';
import {ValidatorNames} from '../ValidatorNames';

/**
 * Can be used on anything with a &quot;length&quot; property (e.g.: strings and arrays)
 */
export function MaxLength(max: number, opts?: Opts): any {
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
