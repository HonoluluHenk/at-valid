import {DEFAULT_GROUP} from '../decorators';
import {CustomConstraint, Nested, Required} from '../decorators';
import {ExecutionPlan, NestedValidatorConfig, PropertyValidatorConfig, ValidationContext} from './ValidationContext';

describe('ValidationContext', () => {
    describe('registerPropertyValidator input validation', () => {
        function makeConfig(overrides: Partial<PropertyValidatorConfig<object>>): PropertyValidatorConfig<object> {
            return {
                name: 'name',
                propertyKey: 'propertyKey',
                messageArgs: {},
                target: {},
                validatorFn: () => true,
                opts: {},
                ...overrides
            };
        }

        const params = [
            {desc: 'name', override: {name: undefined}, expected: 'name/class required'},
            {desc: 'name', override: {name: null}, expected: 'name/class required'},
            {desc: 'name', override: {name: ''}, expected: 'name/class required'},
            {desc: 'propertyKey', override: {propertyKey: undefined}, expected: 'propertyKey required'},
            {desc: 'propertyKey', override: {propertyKey: null}, expected: 'propertyKey required'},
            {desc: 'propertyKey', override: {propertyKey: ''}, expected: 'propertyKey required'},
            {
                desc: 'propertyKey/Symbol', override: {propertyKey: Symbol()},
                expected: 'Symbols not supported (target:' + ' Object@Symbol())'
            },
            {desc: 'target', override: {target: null}, expected: 'target required'},
            {desc: 'target', override: {target: undefined}, expected: 'target required'},
            {desc: 'validatorFn', override: {validatorFn: undefined}, expected: 'validatorFn required'},
            {desc: 'validatorFn', override: {validatorFn: undefined}, expected: 'validatorFn required'},
        ];

        params.forEach(param => {
            it(`should validate ${param.desc}: ${JSON.stringify(param.override)}`, () => {
                const config = makeConfig(param.override as any);

                expect(() => ValidationContext.instance.registerPropertyValidator(config))
                    .toThrowError(param.expected);
            });
        });
    });

    describe('registerNested input validation', () => {
        function makeConfig(overrides: Partial<NestedValidatorConfig>): NestedValidatorConfig {
            return {
                name: 'name',
                propertyKey: 'propertyKey',
                target: {},
                opts: {},
                ...overrides
            };
        }

        const params = [
            {desc: 'propertyKey', override: {propertyKey: undefined}, expected: 'propertyKey required'},
            {desc: 'propertyKey', override: {propertyKey: null}, expected: 'propertyKey required'},
            {desc: 'propertyKey', override: {propertyKey: ''}, expected: 'propertyKey required'},
            {
                desc: 'propertyKey/Symbol', override: {propertyKey: Symbol()},
                expected: 'Symbols not supported (target:' + ' Object@Symbol())'
            },
            {desc: 'target', override: {target: null}, expected: 'target required'},
            {desc: 'target', override: {target: undefined}, expected: 'target required'},
        ];

        params.forEach(param => {
            it(`should validate ${param.desc}: ${JSON.stringify(param.override)}`, () => {
                const config = makeConfig(param.override as any);

                expect(() => ValidationContext.instance.registerNested(config))
                    .toThrowError(param.expected);
            });
        });
    });

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

        describe('class not registered', () => {
            it('should fail', () => {
                expect(() => ValidationContext.instance.buildExecutionPlan({}, []))
                    .toThrowError('class not registered: Object');
            });
        });

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
                                    targetClass: Outer,
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
                                targetClass: Inner,
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

                expect(actual)
                    .toEqual({
                            groups: {
                                FIRST: {
                                    targetClass: GroupTesting,
                                    propertyValidators: {
                                        value: [{
                                            name: 'first',
                                            propertyKey: 'value',
                                            target: {},
                                            validatorFn: jasmine.any(Function) as any,
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

                expect(actual)
                    .toEqual({
                            groups: {
                                SECOND: {
                                    targetClass: GroupTesting,
                                    propertyValidators: {
                                        value: [
                                            {
                                                name: 'second',
                                                propertyKey: 'value',
                                                target: {},
                                                validatorFn: jasmine.any(Function) as any,
                                                validatorFnContext: {args: {}, customContext: {}},
                                                groups: ['SECOND']
                                            },
                                            {
                                                name: 'third',
                                                propertyKey: 'value',
                                                target: {},
                                                validatorFn: jasmine.any(Function) as any,
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

                expect(actual)
                    .toEqual({
                            groups: {
                                THIRD: {
                                    targetClass: GroupTesting,
                                    propertyValidators: {
                                        value: [{
                                            name: 'third',
                                            propertyKey: 'value',
                                            target: {},
                                            validatorFn: jasmine.any(Function) as any,
                                            validatorFnContext: {args: {}, customContext: {}},
                                            groups: ['SECOND', 'THIRD']
                                        }]
                                    }
                                },
                                FIRST: {
                                    targetClass: GroupTesting,
                                    propertyValidators: {
                                        value: [{
                                            name: 'first',
                                            propertyKey: 'value',
                                            target: {},
                                            validatorFn: jasmine.any(Function) as any,
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
