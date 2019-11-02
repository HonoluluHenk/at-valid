import {DecoratorValidator} from '../src/validator/DecoratorValidator';
import {CustomContext} from '../src/validator/ValidationContext';
import {ValidationResult} from '../src/validator/ValidationResult';

interface TestBuilder<T extends object> {
    readonly validatorName: string;
    readonly propertyKey: string;
    readonly ctor: new (value: any) => T;
    readonly build: (valids: any[], invalids: any[]) => TestBuilder<T>;
    readonly buildWithContext: (invalidValue: any, customContext: CustomContext) => TestBuilder<T>;
}

/**
 * Build describe/it blocks used by an estimated 99% of all validators.
 */
export function testBuilder<T extends object>(
        validatorName: string,
        propertyKey: string,
        ctor: new (value: any) => T,
        expectedArgs?: object
): TestBuilder<T> {

    const builder = {
        validatorName,
        propertyKey,
        ctor,
        build: (valids: any[], invalids: any[]) => {
            build(validatorName, propertyKey, ctor, valids, invalids, expectedArgs, undefined);

            return builder;
        },
        buildWithContext: (invalidValue: any, customContext: CustomContext) => {
            build(validatorName, propertyKey, ctor, [], [invalidValue], expectedArgs, customContext);

            return builder;
        }
    };

    return builder;
}

function build<T extends object>(
        validatorName: string,
        propertyKey: string,
        ctor: new (value: any) => T,
        valids: T[],
        invalids: T[],
        args: object | undefined,
        customContext: object | undefined
): void {
    describe('valid values', () => {
        valids.forEach((value, idx) => {
            it(`should succeed, #${idx}: ${JSON.stringify(value)}`, async () => {
                const fixture = new ctor(value);

                const actual = await new DecoratorValidator().validate(fixture);

                expect(actual.isSuccess)
                        .toEqual(true);
            });
        });
    });

    describe('invalid values', () => {
        invalids.forEach((value, idx) => {
            it(`should fail, #${idx}: ${JSON.stringify(value)}`, async () => {
                const fixture = new ctor(value);

                const actual = await new DecoratorValidator().validate(fixture);
                expect(actual)
                        .toEqual(ValidationResult.create({
                            [propertyKey]: {
                                validatorName,
                                propertyKey,
                                path: '$.' + propertyKey,
                                value,
                                validatorFnContext: {args: (args || {}), customContext: customContext || {}}
                            }
                        }));
            });
        });
    });

}
