import {distinct} from './distinct';

describe('distinct', () => {
	interface Param {
		input: any[],
		expected: any[]
	}

	const params: Param[] = [
		{input: [], expected: []},
		{input: ["foo"], expected: ["foo"]},
		{input: ["foo", "bar"], expected: ["foo", "bar"]},
		{input: ["foo", "bar", "foo"], expected: ["foo", "bar"]},
		{input: ["foo", "bar", "bar"], expected: ["foo", "bar"]},
		{input: ["foo", "foo", "bar"], expected: ["foo", "bar"]},
		{input: ["foo", "bar", "baz", "foo"], expected: ["foo", "bar", "baz"]},
		// undefined
		{input: [undefined], expected: [undefined]},
		{input: [undefined, undefined], expected: [undefined]},
		{input: ["foo", undefined, undefined, "foo"], expected: ["foo", undefined]},
		{input: [undefined, "foo", undefined, "foo"], expected: [undefined, "foo"]},
		// null
		{input: [null], expected: [null]},
		{input: [null, null], expected: [null]},
		{input: ["foo", null, null, "foo"], expected: ["foo", null]},
		{input: [null, "foo", null, "foo"], expected: [null, "foo"]},
		// mixture of value, null, undefined
		{input: [null, "foo", undefined], expected: [null, "foo", undefined]},
		{input: ["foo", null, null, "foo", undefined, "foo", undefined], expected: ["foo", null, undefined]},
	];

	describe('using the value directly', () => {
		params.forEach((param, idx) => {
			it(`should produce valid output (#${idx}: ${JSON.stringify(param.input)})`, () => {
				const actual = param.input.filter(distinct());

				expect(actual)
						.toEqual(param.expected);
			});
		});
	});

	describe('using the keyExtractor', () => {
		// too bored to type the same testcases just with an object Array<{key: any}> again.
		// => map the existing params to this new structure:
		function mapToTestcase(arr: any[]): Array<{key: any}> {
			return arr.map(value => {
				return {key: value}
			});
		}

		const keyParams = params.map(p => {
			return {
				input: [...mapToTestcase(p.input)],
				expected: [...mapToTestcase(p.expected)]
			}
		});
		keyParams.forEach((param, idx) => {
			it(`should produce valid output (#${idx}: ${JSON.stringify(param.input)})`, () => {
				const actual = param.input.filter(distinct(v => v.key));

				expect(actual)
						.toEqual(param.expected);
			});
		});
	});
});
