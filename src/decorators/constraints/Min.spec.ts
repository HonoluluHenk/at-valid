import {testBuilder} from "../../../tests/test-builder.spec";
import {VERY_SMALL_NUMBER} from "../../../tests/test-constants.spec";
import {Min} from "./Min";

describe('Min', () => {
	class TestClassMinInclusive {
		@Min(5)
		public value: any;

		constructor(value: any) {
			this.value = value;
		}
	}

	class TestClassMinExclusive {
		@Min(5, false)
		public value: any;

		constructor(value: any) {
			this.value = value;
		}
	}

	class TestClassWithContext {
		@Min(5, true, {customContext: {should: "propagate to error"}})
		public value: any;

		constructor(value: any) {
			this.value = value;
		}
	}

	const validsInclusive: any[] = [
		undefined,
		null,
		5,
		5.0001,
		5 + Number.EPSILON,
		Number.POSITIVE_INFINITY,
		Number.MAX_SAFE_INTEGER,
		Number.MAX_VALUE
	];

	const validsExclusive: any[] = [
		undefined,
		null,
		//5:  this is the difference to Inclusive
		5.0001,
		5 + VERY_SMALL_NUMBER,
		Number.POSITIVE_INFINITY,
		Number.MAX_SAFE_INTEGER,
		Number.MAX_VALUE
	];

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
		5 - VERY_SMALL_NUMBER,
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
		5 - VERY_SMALL_NUMBER,
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

	describe('range inclusive', () => {
		testBuilder("Min", "value", TestClassMinInclusive, {min: 5, inclusive: true})
				.build(validsInclusive, invalidsInclusive);
	});
	describe('range exclusive', () => {
		testBuilder("Min", "value", TestClassMinExclusive, {min: 5, inclusive: false})
				.build(validsExclusive, invalidsExclusive);
	});
	describe('customContext', () => {
		testBuilder("Min", "value", TestClassWithContext, {min: 5, inclusive: true})
				.buildWithContext("invalid", {should: "propagate to error"});
	});

});