import {isEmpty} from '../../util/isEmpty';
import {Opts, ValidationContext} from '../../validator/ValidationContext';
import {ValidatorNames} from '../ValidatorNames';

/**
 * Same as {@link IsDate} but with all time components set to zero.
 */
export function IsDate(utc: boolean = false, opts?: Opts): any {

    function dateComponentsZero(value: Date) {
        if (utc) {
            return value.getUTCHours() === 0
                    && value.getUTCMinutes() === 0
                    && value.getUTCSeconds() === 0
                    && value.getUTCMilliseconds() === 0;
        }

        return value.getHours() === 0
                && value.getMinutes() === 0
                && value.getSeconds() === 0
                && value.getMilliseconds() === 0;
    }

    function isValid(value: any): boolean {
        return isEmpty(value) || value instanceof Date && dateComponentsZero(value);
    }

    return (target: object, propertyKey: string) => {
        ValidationContext.instance.registerPropertyValidator({
            name: ValidatorNames.IsDate,
            messageArgs: {utc},
            target,
            propertyKey,
            validatorFn: value => isValid(value),
            opts
        });
    };
}
