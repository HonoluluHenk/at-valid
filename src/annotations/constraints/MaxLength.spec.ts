import {testBuilder} from "../../../tests/test-builder.spec";
import {MaxLength} from './MaxLength';

describe('MaxLength', () => {
	class TestClass {
		@MaxLength(5)
		public bar?: string | null;

		constructor(bar: string | null | undefined) {
			this.bar = bar;
		}
	}

	class TestClassWithContext {
		@MaxLength(5, {customContext: {should: "propagate to error"}})
		public bar?: string | null;

		constructor(bar: string | null | undefined) {
			this.bar = bar;
		}
	}

	const valids = [
		"",
		"a",
		"12345",
		[1],
		[1, 2, 3, 4, 5]
	];

	const invalids = [
		"123456",
		"123456asdfasdfasdfasdf",
		{},
		0,
		1,
		-1,
		NaN,
		new Date(2019, 11, 31),
		true,
		false,
		Symbol(),
	];

	testBuilder("MaxLength", "bar", TestClass, {max: 5})
			.build(valids, invalids);
	testBuilder("MaxLength", "bar", TestClassWithContext, {max: 5})
			.buildWithContext({should: "propagate to error"}, valids, invalids);
});
