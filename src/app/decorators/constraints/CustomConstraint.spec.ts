import {DecoratorValidator} from '../../validator/DecoratorValidator';
import {ValidatorFn} from '../../validator/ValidationContext';
import {ValidationResult} from '../../validator/ValidationResult';
import {CustomConstraint} from './CustomConstraint';
import Spy = jasmine.Spy;

describe(`CustomConstraint`, () => {
    let validation: Spy<ValidatorFn<any>>;

    // we need the validationFn at instantiation but also need to createSpy in beforeEach
    // (this is a requirement for toHaveBeenCalledTimes())
    // These two goals are mutually exclusive.
    // => Use the proxy function (which is defined at instantiation) to call the actual spy instance.
    const validationProxy: ValidatorFn<any> = (value, ctx, targetInstance) => validation(value, ctx, targetInstance);

    beforeEach(() => {
        validation = jasmine.createSpy('validation');
        validation.and.returnValue(false);
    });

    describe('no args', () => {

        class TestClass {
            @CustomConstraint('CustomConstraintTest', validationProxy)
            public value: any;

            constructor(value: any) {
                this.value = value;
            }
        }

        it('should call the validation function once', async () => {
            const fixture = new TestClass('foobar');

            const ignored = await new DecoratorValidator().validate(fixture);

            expect(validation)
                .toHaveBeenCalledWith('foobar', {args: {}, customContext: {}}, fixture);
            expect(validation)
                .toHaveBeenCalledTimes(1);
        });

        it('should build the validation result with custom params', async () => {
            validation.and.returnValue(false);
            const fixture = new TestClass('foobar');

            const actual = await new DecoratorValidator().validate(fixture);

            expect(actual)
                .toEqual(ValidationResult.create({
                    value: {
                        validatorName: 'CustomConstraintTest',
                        propertyKey: 'value',
                        path: '$.value',
                        value: 'foobar',
                        validatorFnContext: {args: {}, customContext: {}}
                    }
                }));
        });

    });

    describe('some args', () => {

        class TestClass {
            @CustomConstraint('CustomConstraintTest', validationProxy, {foo: 'bar'})
            public value: any;

            constructor(value: any) {
                this.value = value;
            }
        }

        it('should call the validation function with args', async () => {
            validation.and.returnValue(false);
            const fixture = new TestClass('foobar');

            const ignored = await new DecoratorValidator().validate(fixture);

            expect(validation)
                .toHaveBeenCalledWith('foobar', {args: {foo: 'bar'}, customContext: {}}, fixture);
            expect(validation)
                .toHaveBeenCalledTimes(1);
        });

        it('should build the validation result with custom params', async () => {
            validation.and.returnValue(false);
            const fixture = new TestClass('foobar');

            const actual = await new DecoratorValidator().validate(fixture);

            expect(actual)
                .toEqual(ValidationResult.create({
                    value: {
                        validatorName: 'CustomConstraintTest',
                        propertyKey: 'value',
                        path: '$.value',
                        value: 'foobar',
                        validatorFnContext: {args: {foo: 'bar'}, customContext: {}}
                    }
                }));
        });

    });

});
