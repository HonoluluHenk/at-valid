import {testBuilder} from '../../../tests/test-builder.spec';
import {DecoratorValidator} from '../../validator/DecoratorValidator';
import {ValidationResult} from '../../validator/ValidationResult';
import {DateProvider, IsBefore} from './IsBefore';
import Spy = jasmine.Spy;

describe('IsBefore', () => {
    const LONG_BEFORE = new Date(1900, 0, 1);
    const CLOSE_BEFORE = new Date(1976, 10, 18, 23, 59, 59, 999);
    const DEADLINE = new Date(1976, 10, 19);
    const CLOSE_AFTER = new Date(1976, 10, 19, 0, 0, 0, 1);
    const LONG_AFTER = new Date(2001, 0, 1);

    class TestClassBeforeExclusive {
        @IsBefore(DEADLINE)
        public value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    class TestClassBeforeInclusive {
        @IsBefore(DEADLINE, true)
        public value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    class TestClassWithContext {
        @IsBefore(DEADLINE, undefined, {customContext: {should: 'be passed to result'}})
        public value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    const invalidTypes = [
        0,
        NaN,
        {},
        '',
        'asdf',
        [],
        ['asdf'],
        true,
        false,
        Symbol(),
    ];

    const validsExclusive = [
        undefined,
        null,
        LONG_BEFORE,
        CLOSE_BEFORE,
    ];

    const validsInclusive = [
        undefined,
        null,
        LONG_BEFORE,
        CLOSE_BEFORE,
        DEADLINE,
    ];

    const invalidsExclusive = [
        DEADLINE,
        CLOSE_AFTER,
        LONG_AFTER,
        ...invalidTypes,
    ];

    const invalidsInclusive = [
        CLOSE_AFTER,
        LONG_AFTER,
        ...invalidTypes,
    ];

    describe('with deadline exlusive', () => {
        testBuilder(
            'IsDatetimeBefore',
            'value',
            TestClassBeforeExclusive,
            {
                date: DEADLINE,
                inclusive: false
            }
        )
            .build(validsExclusive, invalidsExclusive);
    });

    describe('with deadline inclusive', () => {
        testBuilder(
            'IsDatetimeBefore',
            'value',
            TestClassBeforeInclusive,
            {
                date: DEADLINE,
                inclusive: true
            }
        )
            .build(validsInclusive, invalidsInclusive);
    });

    describe('passing context', () => {
        testBuilder(
            'IsDatetimeBefore',
            'value',
            TestClassWithContext,
            {
                date: DEADLINE,
                inclusive: false
            }
        )
            .buildWithContext(DEADLINE, {should: 'be passed to result'});
    });

    describe('with dateProvider', () => {
        const REFERENCE = new Date(1900, 0, 1);
        const INVALID = new Date(2000, 0, 1);

        let dateProviderSpy: Spy<DateProvider<WithDateProvider>>;
        const dateProviderProxy: DateProvider<WithDateProvider> = arg => dateProviderSpy(arg);

        class WithDateProvider {
            @IsBefore(dateProviderProxy)
            public value: any;

            constructor(value: any) {
                this.value = value;
            }
        }

        beforeEach(() => {
            dateProviderSpy = jasmine.createSpy('dateProviderSpy');
            dateProviderSpy.and.returnValue(REFERENCE);
        });

        it('should produce the expected error message', async () => {
            const fixture = new WithDateProvider(INVALID);

            const actual = await new DecoratorValidator().validate(fixture);

            expect(actual.isSuccess)
                .toEqual(false);

            expect(actual)
                .toEqual(ValidationResult.create({
                    value: {
                        validatorName: 'IsDatetimeBefore',
                        propertyKey: 'value',
                        path: '$.value',
                        value: INVALID,
                        validatorFnContext: {args: {date: REFERENCE, inclusive: false}, customContext: {}}
                    }
                }));
        });

        it('should call the dateProvider correctly', async () => {
            const fixture = new WithDateProvider(INVALID);

            const ignored = await new DecoratorValidator().validate(fixture);

            expect(dateProviderSpy)
                .toHaveBeenCalledWith(fixture);

            expect(dateProviderSpy)
                .toHaveBeenCalledTimes(1);
        });
    });

});