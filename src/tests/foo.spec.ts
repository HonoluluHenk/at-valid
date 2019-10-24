import {Validator} from "../validator/Validator";

describe('Validatro should instantiate', () => {
	it('should instantiate', () => {
		expect(new Validator())
				.toBeTruthy();
	});
});