import {DecoratorValidator} from "../validator/DecoratorValidator";

describe('Validatro should instantiate', () => {
	it('should instantiate', () => {
		expect(new DecoratorValidator())
				.toBeTruthy();
	});
});