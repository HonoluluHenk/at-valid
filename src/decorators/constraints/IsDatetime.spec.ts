import {testBuilder} from "../../../tests/test-builder.spec";
import {IsDatetime} from "./IsDatetime";

describe('IsDatetime', () => {
	class TestClass {
		@IsDatetime()
		public value: any;

		constructor(value: any) {
			this.value = value;
		}
	}

	class TestClassWithContext {
		@IsDatetime({customContext: {should: "be passed to result"}})
		public value: any;

		constructor(value: any) {
			this.value = value;
		}
	}

	const valids = [
		undefined,
		null,
		new Date()
	];

	const invalids = [
		0,
		NaN,
		{},
		"",
		"asdf",
		[],
		["asdf"],
		true,
		false,
		Symbol(),
	];

	testBuilder(
			"IsDatetime",
			"value",
			TestClass
	)
			.build(valids, invalids);

	testBuilder(
			"IsDatetime",
			"value",
			TestClassWithContext
	)
			.buildWithContext("invalid", {should: "be passed to result"});
});
