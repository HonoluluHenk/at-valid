import {Nested} from "../annotations/Nested";
import {Required} from "../annotations/Required";
import {DEFAULT_GROUP, ExecutionPlan, PropertyValidator, ValidationContext} from "./ValidationContext";

describe('ValidationContext', () => {
	describe('buildExecutionPlan', () => {
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

		describe('nesting is not part of the execution plan', () => {
			const params = [
				new Outer(),
				new Outer(new Inner()),
				new Outer(new Inner("banana"))
			];

			params.forEach(param =>
					it(`should always build the same plan for all variations of child classes: ${JSON.stringify(param)}`, () => {
						const targetInstance = new Outer();
						const plan: ExecutionPlan = ValidationContext.instance.buildExecutionPlan(targetInstance, [DEFAULT_GROUP]);

						expect(plan)
								.toEqual({
									groups: {
										DEFAULT: {
											targetInstance,
											propertyValidators: {
												bar: [new PropertyValidator(
														'Nested',
														'bar',
														{},
														'NESTED',
														{args: {}, customContext: {}},
														[DEFAULT_GROUP]
												)]
											}
										}
									}
								});
					})
			);
		});

		it('execution plan of nested class is correctly built', () => {
			const outerInstance = new Outer(new Inner("testint"));
			const targetInstance = outerInstance.bar!;
			const plan: ExecutionPlan = ValidationContext.instance.buildExecutionPlan(targetInstance, [DEFAULT_GROUP]);

			expect(plan)
					.toEqual({
						groups: {
							DEFAULT: {
								targetInstance,
								propertyValidators: {
									banana: [new PropertyValidator(
											'Required',
											'banana',
											{},
											jasmine.any(Function) as any,
											{args: {}, customContext: {}},
											[DEFAULT_GROUP]
									)]
								}
							}
						}
					});
		});
	});

});