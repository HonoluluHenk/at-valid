import {DecoratorValidator} from '../validator/DecoratorValidator';
import {ValidationResult} from '../validator/ValidationResult';
import {Required} from './constraints/Required';
import {Nested} from './Nested';

describe('Nested', () => {
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

    it('should succeed on an empty but not required nested instance', async () => {
        const actual = await new DecoratorValidator().validate(new Outer());

        expect(actual.isSuccess)
            .toBe(true);
    });

    it('should succeed on a valid nested instance', async () => {
        const actual = await new DecoratorValidator().validate(new Outer(new Inner('Hello World')));

        expect(actual.isSuccess)
            .toBe(true);
    });

    it('should fail on an invalid nested instance', async () => {
        const fixture = new Outer(new Inner());
        const actual = await new DecoratorValidator().validate(fixture);

        expect(actual.isSuccess)
            .toBe(false);

        expect(actual)
            .toEqual(ValidationResult.create({
                    bar: {
                        validatorName: 'Nested',
                        propertyKey: 'bar',
                        value: fixture.bar,
                        path: '$.bar',
                        validatorFnContext: {args: {}, customContext: {}},
                        childValidation: ValidationResult.create({
                                banana: {
                                    validatorName: 'Required',
                                    propertyKey: 'banana',
                                    value: fixture.bar!.banana,
                                    path: '$.bar.banana',
                                    validatorFnContext: {args: {}, customContext: {}}
                                }
                            }
                            , undefined
                        )
                    }
                },
                undefined));
    });

});
