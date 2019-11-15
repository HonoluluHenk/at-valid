import {DateProvider} from '../../util/DateProvider';
import {isEmpty} from '../../util/isEmpty';
import {CustomFailure, Opts, ValidationContext} from '../../validator/ValidationContext';
import {ValidatorNames} from '../../validator/ValidatorNames';

/**
 * The {@link Date} value must be after some instant.
 */
export function IsAfter<T extends object>(
    date: Date | DateProvider<T>,
    inclusive: boolean = false,
    opts?: Opts
): (target: object, propertyKey: string) => void {

    function isInRange(value: Date, reference: Date): boolean {
        if (inclusive) {
            return value.getTime() >= reference.getTime();
        } else {
            return value.getTime() > reference.getTime();
        }
    }

    function isValid(value: any, targetInstance: T): boolean | CustomFailure {
        let reference: Date;

        if (date instanceof Date) {
            reference = date;
        } else {
            reference = date(targetInstance);
        }

        const result = isEmpty(value) || value instanceof Date && isInRange(value, reference);
        if (result) {
            return true;
        }

        return {
            messageArgs: {date: reference, inclusive}
        };
    }

    return (target: object, propertyKey: string) => {
        ValidationContext.instance.registerPropertyValidator({
            name: ValidatorNames.IsAfter,
            target,
            propertyKey,
            messageArgs: {date},
            validatorFn: (value, _, targetInstance) => isValid(value, targetInstance as T),
            opts
        });
    };
}
