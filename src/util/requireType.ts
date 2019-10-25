// FIXME: does not work as expected.
// The value in the type parameter might denote a different type than is specified by T
// e.g.:
//     const s: string = requireType(123, 'number')
// will compile fine.

export function requireType<T>(
		value: any | null | undefined,
		type: 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined'
): T {
	if (typeof value !== type) {
		throw new Error(`invalid type: ${typeof value}, required type: ${type}`);
	}

	return value as T;
}
