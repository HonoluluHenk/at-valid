import {groupBy} from './groupBy';

fdescribe('groupBy', () => {
	class Foo {
		constructor(
				public readonly key: string | null | undefined,
				public readonly value: string
		) {
		}
	}

	function mk(...entries: Array<[string | null | undefined, string]>): Foo[] {
		return entries.map(e => new Foo(e[0], e[1]));
	}

	it('should return an empty object on empty input', () => {
		const actual = ([] as Foo[])
				.reduce(groupBy(v => v.key), {});

		expect(actual)
				.toEqual({});
	});

	it('should skip values with null or undefined key', () => {
		const actual = mk(
				['hello', 'world'],
				[null, 'null-key'],
				[undefined, 'undefined-key'],
				['hello', 'stranger'])
				.reduce(groupBy(v => v.key), {});

		expect(actual)
				.toEqual({
					"hello": [new Foo('hello', 'world'), new Foo('hello', 'stranger')]
				})
	});

	it('should return a single entry on single-entry input', () => {
		const actual = mk(['hello', 'world'])
				.reduce(groupBy(v => v.key), {});

		expect(actual)
				.toEqual({'hello': [new Foo('hello', 'world')]});
	});

	it('should group values by their key', () => {
		const actual = mk(['hello', 'world'], ['hello', 'stranger'], ['happy', 'new year'])
				.reduce(groupBy(v => v.key), {});

		expect(actual)
				.toEqual({
					'hello': [new Foo('hello', 'world'), new Foo('hello', 'stranger')],
					'happy': [new Foo('happy', 'new year')]
				});
	})
});
