import {testBuilder} from "../../../tests/test-builder.spec";
import {Min} from "./Min";

describe('Min', () => {
	class TestClassMinInclusive {
		@Min(5)
		public value: number | null | undefined;

		constructor(bar: any | null | undefined) {
			this.value = bar;
		}
	}

	class TestClassMinExclusive {
		@Min(5, false)
		public value: number | null | undefined;

		constructor(bar: any | null | undefined) {
			this.value = bar;
		}
	}

	class TestClassWithContext {
		@Min(5, true, {customContext: {should: "propagate to error"}})
		public value?: number | null;

		constructor(value: number | null | undefined) {
			this.value = value;
		}
	}

	// noinspection MagicNumberJS
	const validsInclusive: any[] = [
		5,
		5.0001,
		5 + Number.EPSILON,
		Number.POSITIVE_INFINITY,
		Number.MAX_SAFE_INTEGER,
		Number.MAX_VALUE
	];

	const validsExclusive: any[] = [
		//5:  this is the difference to Inclusive
		5.0001,
		5 + Number.EPSILON,
		Number.POSITIVE_INFINITY,
		Number.MAX_SAFE_INTEGER,
		Number.MAX_VALUE
	];

	// noinspection MagicNumberJS
	const invalidsInclusive = [
		"",
		"1234",
		0,
		1,
		-1,
		4,
		4.99999999,
		//  Note: (5 - EPSILON) or (5 - 2 * EPSILON) can not be represented and thus is rounded back up to 5
		// ... and thus fails this test
		5 - 3 * Number.EPSILON,
		NaN,
		new Date(2019, 11, 31),
		true,
		false,
		Symbol(),
		[],
		[99],
		{},
		{min: 99},
	];

	const invalidsExclusive = [
		5, // this is the difference to Inclusive
		"",
		"1234",
		0,
		1,
		-1,
		4,
		4.99999999,
		//  Note: (5 - EPSILON) or (5 - 2 * EPSILON) can not be represented and thus is rounded back up to 5
		// ... and thus fails this test
		5 - 3 * Number.EPSILON,
		NaN,
		new Date(2019, 11, 31),
		true,
		false,
		Symbol(),
		[],
		[99],
		{},
		{min: 99},
	];

	testBuilder("Min", "value", TestClassMinInclusive, {min: 5, inclusive: true})
			.build(validsInclusive, invalidsInclusive);
	testBuilder("Min", "value", TestClassMinExclusive, {min: 5, inclusive: false})
			.build(validsExclusive, invalidsExclusive);
	testBuilder("Min", "value", TestClassWithContext, {min: 5, inclusive: true})
			.buildWithContext({should: "propagate to error"}, validsInclusive, invalidsInclusive);

});