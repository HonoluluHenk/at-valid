import {isEmpty} from '../../util/isEmpty';
import {Opts, ValidationContext} from '../../validator/ValidationContext';
import {ValidatorNames} from '../ValidatorNames';

/**
 * The value must be an entry of the given enum (string or indexed).
 *
 * Example usage:
 * <pre><code>
 * enum Foo {
 *     hello,
 *     world
 * }
 *
 * class Test {
 *     @IsEnum(Foo)
 *     value: any
 * }
 * </code</pre>
 */
export function IsEnum(
    enumClass: object,
    opts?: Opts
): (target: object, propertyKey: string) => void {

    function isValid(value: any): boolean {
        // tslint:disable-next-line
        return isEmpty(value) || (Object as any).values(enumClass).includes(value);
    }

    return (target: object, propertyKey: string) => {
        ValidationContext.instance.registerPropertyValidator({
            name: ValidatorNames.IsEnum,
            target,
            propertyKey,
            messageArgs: {enumClass},
            validatorFn: value => isValid(value),
            opts
        });
    };
}
