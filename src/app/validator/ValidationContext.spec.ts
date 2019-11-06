import {CustomConstraint} from '../decorators/constraints/CustomConstraint';
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

        describe('nested class', () => {
            it('execution plan of nested class is correctly built', () => {
                const outerInstance = new Outer(new Inner('testint'));
                const targetInstance = outerInstance.bar!;
                const plan: ExecutionPlan = ValidationContext.instance
                    .buildExecutionPlan(targetInstance, [DEFAULT_GROUP]);

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

        describe('groups', () => {
            class GroupTesting {
                @CustomConstraint('first', () => true, undefined, {groups: ['FIRST']})
                @CustomConstraint('second', () => true, undefined, {groups: ['SECOND']})
                @CustomConstraint('third', () => true, undefined, {groups: ['SECOND', 'THIRD']})
                value?: string;
            }

            it('should should only plan FIRST group ', () => {
                const fixture = new GroupTesting();
                const actual = ValidationContext.instance
                    .buildExecutionPlan(fixture, ['FIRST']);

                expect(JSON.parse(JSON.stringify(actual)))
                    .toEqual({
                            groups: {
                                FIRST: {
                                    targetInstance: {},
                                    propertyValidators: {
                                        value: [{
                                            name: 'first',
                                            propertyKey: 'value',
                                            target: {},
                                            validatorFnContext: {args: {}, customContext: {}},
                                            groups: ['FIRST']
                                        }]
                                    }
                                }
                            }
                        }
                    );
            });

            it('should should only plan SECOND group ', () => {
                const fixture = new GroupTesting();
                const actual = ValidationContext.instance
                    .buildExecutionPlan(fixture, ['SECOND']);

                expect(JSON.parse(JSON.stringify(actual)))
                    .toEqual({
                            groups: {
                                SECOND: {
                                    targetInstance: {},
                                    propertyValidators: {
                                        value: [
                                            {
                                                name: 'second',
                                                propertyKey: 'value',
                                                target: {},
                                                validatorFnContext: {args: {}, customContext: {}},
                                                groups: ['SECOND']
                                            },
                                            {
                                                name: 'third',
                                                propertyKey: 'value',
                                                target: {},
                                                validatorFnContext: {args: {}, customContext: {}},
                                                groups: ['SECOND', 'THIRD']
                                            },
                                        ]
                                    }
                                }
                            }
                        }
                    );
            });

            it('should should only plan THIRD and FIRST group ', () => {
                const fixture = new GroupTesting();
                const actual = ValidationContext.instance
                    .buildExecutionPlan(fixture, ['THIRD', 'FIRST']);

                expect(JSON.parse(JSON.stringify(actual)))
                    .toEqual({
                            groups: {
                                THIRD: {
                                    targetInstance: {},
                                    propertyValidators: {
                                        value: [{
                                            name: 'third',
                                            propertyKey: 'value',
                                            target: {},
                                            validatorFnContext: {args: {}, customContext: {}},
                                            groups: ['SECOND', 'THIRD']
                                        }]
                                    }
                                },
                                FIRST: {
                                    targetInstance: {},
                                    propertyValidators: {
                                        value: [{
                                            name: 'first',
                                            propertyKey: 'value',
                                            target: {},
                                            validatorFnContext: {args: {}, customContext: {}},
                                            groups: ['FIRST']
                                        }]
                                    }
                                }
                            }
                        }
                    );
            });
        });
    });

});
