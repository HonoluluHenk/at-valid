import {testBuilder} from "../../../tests/test-builder.spec";
import {IsNumber} from "./IsNumber";

describe('IsNumber', () => {
	class Fixture {
		@IsNumber()
		public foo?: any;

		constructor(foo?: any) {
			this.foo = foo;
		}
	}

	class FixtureWithContext {
		@IsNumber({customContext: {should: "be passed to result"}})
		public foo?: any;

		constructor(foo?: any) {
			this.foo = foo;
		}
	}

	const valids = [
		0,
		-0,
		1,
		-1,
		0.5,
		-0.5,
		Number.MAX_SAFE_INTEGER,
		Number.MAX_VALUE,
		Number.MIN_VALUE,
		Number.MIN_SAFE_INTEGER,
		Number.EPSILON,
		Number.NEGATIVE_INFINITY,
		Number.POSITIVE_INFINITY,
	];

	const invalids = [
		{},
		"",
		"asdf",
		new Date(2019, 11, 31),
		[],
		["asdf"],
		true,
		false,
		Symbol(),
	];

	testBuilder(
			"IsNumber",
			"foo",
			Fixture
	)
			.build(valids, invalids);

	testBuilder(
			"IsNumber",
			"foo",
			FixtureWithContext
	)
			.buildWithContext({should: "be passed to result"}, valids, invalids);
});
