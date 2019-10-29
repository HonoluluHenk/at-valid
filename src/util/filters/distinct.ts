/**
 * Array filter function.
 *
 * Only returns the first entry for a given key, including null and undefined.
 */
export function distinct<V>(keyExtractor?: (v: V) => string | null | undefined): (next: V) => boolean {
	const existing: any[] = [];

	return (next: V) => {
		let key;
		if (keyExtractor) {
			key = keyExtractor(next);
		} else {
			key = next;
		}


		if (existing.indexOf(key) >= 0) {
			return false;
		}
		existing.push(key);

		return true;
	}
}
