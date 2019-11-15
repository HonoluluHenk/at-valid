import {DecoratorValidator, Opts, ValidationContext} from '../app/validator';

const a1 = 'a1';
const a2 = 'a2';
const a3 = 'a3';
const b1 = 'b1';
const b2 = 'b2';
const b3 = 'b3';

describe('async validators', () => {
    let a1Spy: jasmine.Spy<() => boolean>;
    let a2Spy: jasmine.Spy<() => boolean>;
    let a3Spy: jasmine.Spy<() => boolean>;
    let b1Spy: jasmine.Spy<() => boolean>;
    let b2Spy: jasmine.Spy<() => boolean>;
    let b3Spy: jasmine.Spy<() => boolean>;

    let calls: { [name: string]: string[] } = {};

    function rememberCall(resultFnFactory: () => () => boolean)
        : (name: string, propertyKey: string) => Promise<boolean> {
        return (name, propertyKey) => {
            const callList = calls[propertyKey] || [];
            callList.push(name);
            calls[propertyKey] = callList;

            return Promise.resolve(resultFnFactory()());
        };
    }

    function Generic(name: string, fn: (name: string, propertyKey: string) => Promise<boolean>, opts?: Opts)
        : (target: object, propertyKey: string) => void {
        return (target: object, propertyKey: string) => {
            ValidationContext.instance.registerPropertyValidator({
                name,
                target,
                propertyKey,
                messageArgs: {},
                validatorFn: () => fn(name, propertyKey),
                opts
            });
        };
    }

    const A1 = (opts?: Opts) => Generic(a1, rememberCall(() => a1Spy), opts);
    const A2 = (opts?: Opts) => Generic(a2, rememberCall(() => a2Spy), opts);
    const A3 = (opts?: Opts) => Generic(a3, rememberCall(() => a3Spy), opts);
    const B1 = (opts?: Opts) => Generic(b1, rememberCall(() => b1Spy), opts);
    const B2 = (opts?: Opts) => Generic(b2, rememberCall(() => b2Spy), opts);
    const B3 = (opts?: Opts) => Generic(b3, rememberCall(() => b3Spy), opts);

    beforeEach(() => {
        calls = {};
        a1Spy = jasmine.createSpy('a1Spy');
        a2Spy = jasmine.createSpy('a2Spy');
        a3Spy = jasmine.createSpy('a3Spy');
        b1Spy = jasmine.createSpy('b1Spy');
        b2Spy = jasmine.createSpy('b2Spy');
        b3Spy = jasmine.createSpy('b3Spy');
    });

    describe('one group. two values', () => {
        class OneGroup {
            @A1()
            @A2()
            @A3()
            a?: string;

            @B1()
            @B2()
            @B3()
            b?: string;
        }

        describe('and no errors', () => {
            beforeEach(() => {
                a1Spy.and.returnValue(true);
                a2Spy.and.returnValue(true);
                a3Spy.and.returnValue(true);

                b1Spy.and.returnValue(true);
                b2Spy.and.returnValue(true);
                b3Spy.and.returnValue(true);
            });

            it('should succeed', async () => {
                const actual = await new DecoratorValidator().validate(new OneGroup());

                expect(actual.isSuccess)
                    .toEqual(true);
            });

            it('should execute all validators', async () => {
                const ignored = await new DecoratorValidator().validate(new OneGroup());

                expect(calls)
                    .toEqual({
                        a: [a1, a2, a3],
                        b: [b1, b2, b3]
                    });
            });
        });

        describe('and an error per property', () => {
            beforeEach(() => {
                a1Spy.and.returnValue(true);
                a2Spy.and.returnValue(false);
                a3Spy.and.returnValue(true);

                b1Spy.and.returnValue(false);
                b2Spy.and.returnValue(true);
                b3Spy.and.returnValue(true);
            });

            it('should fail', async () => {
                const actual = await new DecoratorValidator().validate(new OneGroup());

                expect(actual.isSuccess)
                    .toEqual(false);
            });

            it('should only execute up to first failure per property', async () => {
                const ignored = await new DecoratorValidator().validate(new OneGroup());

                expect(calls)
                    .toEqual({
                        a: [a1, a2],
                        b: [b1]
                    });
            });
        });

    });

});
