/**
 * array reducer function, <strong>requires</strong> the seed: {}!
 *
 * If keyExtractor resolves to null or undefined, the value is skipped!
 */
export function groupBy<V>(keyExtractor: (v: V) => string | null | undefined): (acc: any, next: V) => any {
	return (acc: any, next: V) => {
		const key = keyExtractor(next);
		if (key === null || key === undefined) {
			return acc;
		}

		const entries = acc[key] || [];
		entries.push(next);
		acc[key] = entries;

		return acc;
	}
}
