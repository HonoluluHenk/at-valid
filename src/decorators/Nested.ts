import {Opts, ValidationContext} from '../validator/ValidationContext';
import {ValidatorNames} from './ValidatorNames';

export function Nested(
    opts?: Opts
): (target: object, propertyKey: string) => void {

    return (target: object, propertyKey: string) => {
        ValidationContext.instance.registerNested({
            name: ValidatorNames.MinLength,
            target,
            propertyKey,
            opts
        });
    };

}
