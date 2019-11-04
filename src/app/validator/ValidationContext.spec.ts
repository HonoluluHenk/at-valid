import {Required} from '../decorators/constraints/Required';
import {Nested} from '../decorators/Nested';
import {DEFAULT_GROUP, ExecutionPlan, ValidationContext} from './ValidationContext';

describe('ValidationContext', () => {
    describe('buildExecutionPlan', () => {
        class Inner {
            @Required()
            banana?: string;

            constructor(banana?: string) {
                this.banana = banana;
            }
        }

        class Outer {
            @Nested()
            bar?: Inner;

            constructor(bar?: Inner) {
                this.bar = bar;
            }
        }

        describe('nesting is not part of the execution plan', () => {
            const params = [
                new Outer(),
                new Outer(new Inner()),
                new Outer(new Inner('banana')),
            ];

            params.forEach(param =>
                it(`should build the same plan for all variations of child classes: ${JSON.stringify(param)}`, () => {
                    const targetInstance = new Outer();
                    const plan: ExecutionPlan = ValidationContext.instance
                        .buildExecutionPlan(targetInstance, [DEFAULT_GROUP]);

                    expect(plan)
                        .toEqual({
                            groups: {
                                DEFAULT: {
                                    targetInstance,
                                    propertyValidators: {
                                        bar: [{
                                            name: 'Nested',
                                            propertyKey: 'bar',
                                            target: {},
                                            validatorFn: 'NESTED',
                                            validatorFnContext: {args: {}, customContext: {}},
                                            groups: [DEFAULT_GROUP]
                                        }]
                                    }
                                }
                            }
                        });
                })
            );
        });

        it('execution plan of nested class is correctly built', () => {
            const outerInstance = new Outer(new Inner('testint'));
            const targetInstance = outerInstance.bar!;
            const plan: ExecutionPlan = ValidationContext.instance.buildExecutionPlan(targetInstance, [DEFAULT_GROUP]);

            expect(plan)
                .toEqual({
                    groups: {
                        DEFAULT: {
                            targetInstance,
                            propertyValidators: {
                                banana: [{
                                    name: 'Required',
                                    propertyKey: 'banana',
                                    target: {},
                                    validatorFn: jasmine.any(Function) as any,
                                    validatorFnContext: {args: {}, customContext: {}},
                                    groups: [DEFAULT_GROUP]
                                }]
                            }
                        }
                    }
                });
        });
    });

});
