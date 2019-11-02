import {ValidatorNames} from '../src/decorators/ValidatorNames';
import {DecoratorValidator} from '../src/validator/DecoratorValidator';
import {DEFAULT_GROUP, Opts, ValidationContext} from '../src/validator/ValidationContext';

describe('groups and ordering', () => {
    function GroupValidator(type: string, opts?: Opts, success: boolean = true): any {
        return (target: object, propertyKey: string) => {
            ValidationContext.instance.registerPropertyValidator({
                name: ValidatorNames.MaxLength,
                target,
                propertyKey,
                validatorFn: () => {
                    executions.push({type, success});

                    return success;
                },
                opts
            });
        };
    }

    let executions: Array<{ type: string, success: boolean }> = [];

    beforeEach(() => {
        // noinspection ReuseOfLocalVariableJS
        executions = [];
    });

    describe('ordering', () => {

        class Foo {
            @GroupValidator("Default")
            @GroupValidator("Default (constant)", {groups: DEFAULT_GROUP})
            @GroupValidator("Default (string)", {groups: "DEFAULT"})
            @GroupValidator("One", {groups: "One"})
            @GroupValidator("Two", {groups: "Two"})
            @GroupValidator("OneAndTwo", {groups: ["One", "Two"]})
            @GroupValidator("TwoAndOne", {groups: ["Two", "One"]})
            @GroupValidator("No Groups (should never executions)", {groups: []})
            public readonly foo = 'ignored';
        }

        const params = [
            {groups: undefined, expected: ["Default", "Default (constant)", "Default (string)"]},
            {groups: [DEFAULT_GROUP], expected: ["Default", "Default (constant)", "Default (string)"]},
            {groups: ["One"], expected: ["One", "OneAndTwo", "TwoAndOne"]},
            {groups: ["Two"], expected: ["Two", "OneAndTwo", "TwoAndOne"]},
            {groups: ["One", "Two"], expected: ["One", "OneAndTwo", "TwoAndOne", "Two"]},
            {groups: ["Two", "One"], expected: ["Two", "OneAndTwo", "TwoAndOne", "One"]},
            {groups: ["nonexisting"], expected: []}
        ];

        params.forEach(param => {
            it(`should execute only matching groups in top-down order (groups: ${param.groups})`, async () => {
                await new DecoratorValidator().validate(new Foo(), {groups: param.groups});

                expect(executions.map(e => e.type))
                    .toEqual(param.expected);
            });
        });
    });

    describe('behavior on vaildation-failure on single property', () => {
        const params = [
            {
                One: true, Two: true, OneAndTwo: true, TwoAndOne: true,
                expected: [
                    {type: "One", success: true},
                    {type: "OneAndTwo", success: true},
                    {type: "TwoAndOne", success: true},
                    {type: "Two", success: true},
                ]
            },
            {
                One: false, Two: true, OneAndTwo: true, TwoAndOne: true,
                expected: [
                    {type: "One", success: false}
                ]
            },
            {
                One: true, Two: false, OneAndTwo: true, TwoAndOne: true,
                expected: [
                    {type: "One", success: true},
                    {type: "OneAndTwo", success: true},
                    {type: "TwoAndOne", success: true},
                    {type: "Two", success: false},
                ]
            },
            {
                One: true, Two: true, OneAndTwo: false, TwoAndOne: true,
                expected: [
                    {type: "One", success: true},
                    {type: "OneAndTwo", success: false},
                ]
            },
            {
                One: true, Two: true, OneAndTwo: true, TwoAndOne: false,
                expected: [
                    {type: "One", success: true},
                    {type: "OneAndTwo", success: true},
                    {type: "TwoAndOne", success: false},
                ]
            },
        ];

        params.forEach((param, idx) => {
            describe(`with group failing (#${idx})`, () => {
                class Foo {
                    @GroupValidator("One", {groups: "One"}, param.One)
                    @GroupValidator("Two", {groups: "Two"}, param.Two)
                    @GroupValidator("OneAndTwo", {groups: ["One", "Two"]}, param.OneAndTwo)
                    @GroupValidator("TwoAndOne", {groups: ["Two", "One"]}, param.TwoAndOne)
                    public readonly foo = 'ignored';
                }

                it(`should execute only expected validators (${param.One}/${param.Two}/${param.OneAndTwo}/${param.TwoAndOne})`, async () => {
                    await new DecoratorValidator().validate(new Foo(), {groups: ["One", "Two"]});

                    // console.debug('executions: ', executions);

                    expect(executions)
                        .toEqual(param.expected);
                })
            });
        });
    });

});
