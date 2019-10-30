import {DecoratorValidator} from "../validator/DecoratorValidator";
import {Nested} from "./Nested";
import {Required} from "./Required";

describe('Nested', () => {
	class Inner {
		@Required()
		public banana?: string;

		constructor(banana?: string) {
			this.banana = banana;
		}
	}

	class Outer {
		@Nested()
		public bar?: Inner;

		constructor(bar?: Inner) {
			this.bar = bar;
		}

	}

	it('should fail on an invalid nested instance', async () => {
		const actual = await new DecoratorValidator().validate(new Outer(new Inner()));

		expect(actual.isSuccess)
				.toBe(false);
	});

	it('should succeed on an empty but not required nested instance', async () => {
		const actual = await new DecoratorValidator().validate(new Outer());

		expect(actual.isSuccess)
				.toBe(false);
	});

	it('should succeed on a valid nested instance', async () => {
		const actual = await new DecoratorValidator().validate(new Outer(new Inner("Hello World")));

		expect(actual.isSuccess)
				.toBe(false);
	});
});