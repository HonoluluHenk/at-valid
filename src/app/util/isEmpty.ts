/**
 * Returns true if value is null or undefined, false otherwise.
 */
export function isEmpty(value: any): value is null | undefined {
    return value === null || value === undefined;
}
