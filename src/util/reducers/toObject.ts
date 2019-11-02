/**
 * array reducer function, <strong>requires</strong> the seed: {}!
 *
 * Builds an object of the array-entries, using the key resolved by keyExtractor as property name.
 *
 * If keyExtractor resolves to null or undefined, the value is skipped!
 */
import {isEmpty} from '../isEmpty';

export function toObject<V>(keyExtractor: (v: V) => string | null | undefined): (acc: any,
                                                                                 next: V) => { [key: string]: V } {
    return (acc: any, next: V) => {
        const key = keyExtractor(next);
        if (isEmpty(key)) {
            return acc;
        }

        acc[key] = next;

        return acc;
    };
}
