import * as uuidValidate from 'uuid-validate';
import {isEmpty} from '../../util/isEmpty';
import {Opts, ValidationContext} from '../../validator/ValidationContext';
import {ValidatorNames} from '../ValidatorNames';

/**
 * The value must be valid UUID.
 *
 * See <a href="https://www.npmjs.com/package/uuid-validate">uuid-validate</a> for details.
 */
export function IsUUID(
    version: number = 4,
    opts?: Opts
): (target: object, propertyKey: string) => void {

    function isValid(value: string) {
        return uuidValidate(value, version);
    }

    return (target: object, propertyKey: string) => {
        ValidationContext.instance.registerPropertyValidator({
            name: ValidatorNames.IsUUID,
            target,
            propertyKey,
            validatorFn: value => isEmpty(value) || (typeof value === 'string' && isValid(value)),
            opts
        });
    };
}
