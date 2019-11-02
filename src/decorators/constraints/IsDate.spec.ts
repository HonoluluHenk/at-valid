import {testBuilder} from "../../../tests/test-builder.spec";
import {IsDate} from "./IsDate";

fdescribe('IsDate', () => {
	class TestClass {
		@IsDate()
		public value: any;

		constructor(value: any) {
			this.value = value;
		}
	}

	class TestClassUTC {
		@IsDate(true)
		public value: any;

		constructor(value: any) {
			this.value = value;
		}
	}

	class TestClassWithContext {
		@IsDate(undefined, {customContext: {should: "be passed to result"}})
		public value: any;

		constructor(value: any) {
			this.value = value;
		}
	}

	const valids = [
		undefined,
		null,
		new Date(1976, 10, 19), // TODO: timezone/summer/winter???
		new Date("1976-11-19 01:00:00 GMT+2"), // TODO: timezone/summer/winter???
	];

	const validsUTC = [
		undefined,
		null,
		new Date(Date.UTC(1976, 10, 19)), // TODO: timezone/summer/winter???
		new Date("1976-11-19 00:00:00 UTC"), // TODO: timezone/summer/winter???
	];

	const invalids = [
		"",
		"Hello World",
		{},
		new Date(1976, 10, 19, 14, 0, 0, 0), // TODO: timezone/summer/winter???
		new Date(1976, 10, 19, 0, 1, 0, 0), // TODO: timezone/summer/winter???
		new Date(1976, 10, 19, 0, 0, 1, 0), // TODO: timezone/summer/winter???
		new Date(1976, 10, 19, 0, 0, 0, 1), // TODO: timezone/summer/winter???
		new Date("1976-11-19 12:12:12 GMT+2"), //TODO: summer/winter???
		[],
		["asdf"],
		Symbol(),
		0,
		NaN,
		-1
	];

	const invalidsUTC = [
		"",
		"Hello World",
		{},
		new Date(Date.UTC(1976, 10, 19, 14, 0, 0, 0)), // TODO: timezone/summer/winter???
		new Date(Date.UTC(1976, 10, 19, 0, 1, 0, 0)), // TODO: timezone/summer/winter???
		new Date(Date.UTC(1976, 10, 19, 0, 0, 1, 0)), // TODO: timezone/summer/winter???
		new Date(Date.UTC(1976, 10, 19, 0, 0, 0, 1)), // TODO: timezone/summer/winter???
		new Date("1976-11-19 12:12:12 GMT+2"), //TODO: summer/winter???
		new Date("1976-11-19 12:12:12 UTC"), //TODO: summer/winter???
		[],
		["asdf"],
		Symbol(),
		0,
		NaN,
		-1
	];


	describe('with local timezone', () => {
		testBuilder(
				"IsDate",
				"value",
				TestClass,
				{utc: false}
		)
				.build(valids, invalids);
	});

	describe('with UTC timezone', () => {
		testBuilder(
				"IsDate",
				"value",
				TestClassUTC,
				{utc: true}
		)
				.build(validsUTC, invalidsUTC);
	});

	describe('custom context passing', () => {
		testBuilder(
				"IsDate",
				"value",
				TestClassWithContext,
				{utc: false}
		)
				.buildWithContext(-1, {should: "be passed to result"});
	});
});
