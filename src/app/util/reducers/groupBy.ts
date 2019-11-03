/**
 * array reducer function, <strong>requires</strong> the seed: {}!
 *
 * Reduces all entries of the same key to an array.
 * If keyExtractor resolves to null or undefined, the value is skipped!
 */
import {isEmpty} from '../isEmpty';

export function groupBy<V>(
    keyExtractor: (v: V) => string | null | undefined
): (acc: any, next: V) => { [key: string]: V[] } {

    return (acc: any, next: V) => {
        const key = keyExtractor(next);
        if (isEmpty(key)) {
            return acc;
        }

        const entries = acc[key] || [];
        entries.push(next);
        acc[key] = entries;

        return acc;
    };
}
