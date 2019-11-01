import {testBuilder} from "../../../tests/test-builder.spec";
import {MinLength} from "./MinLength";

describe('MinLength', () => {
	class TestClass {
		@MinLength(5)
		public bar?: string | null;

		constructor(bar: string | null | undefined) {
			this.bar = bar;
		}
	}

	class TestClassWithContext {
		@MinLength(5, {customContext: {should: "propagate to error"}})
		public bar?: string | null;

		constructor(bar: string | null | undefined) {
			this.bar = bar;
		}
	}

	const valids = [
		"12345",
		"Hello World"
	];

	// noinspection MagicNumberJS
	const invalids = [
		"",
		"1234",
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

	testBuilder("MinLength", "bar", TestClass, {min: 5})
			.build(valids, invalids);
	testBuilder("MinLength", "bar", TestClassWithContext, {min: 5})
			.buildWithContext({should: "propagate to error"}, valids, invalids);

});
