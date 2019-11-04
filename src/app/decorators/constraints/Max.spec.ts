import {testBuilder} from '../../../tests/test-builder.spec';
import {VERY_SMALL_NUMBER} from '../../../tests/test-constants.spec';
import {Max} from './Max';

describe('Max', () => {
    class TestClassMaxInclusive {
        @Max(5)
        value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    class TestClassMaxExclusive {
        @Max(5, false)
        value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    class TestClassWithContext {
        @Max(5, true, {customContext: {should: 'propagate to error'}})
        value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    const validsInclusive: any[] = [
        undefined,
        null,
        5,
        0,
        1,
        -1,
        4,
        4.99999999,
        Number.NEGATIVE_INFINITY,
        Number.MIN_SAFE_INTEGER,
        Number.MIN_VALUE,
    ];

    const invalidsInclusive = [
        5.0001,
        5 + VERY_SMALL_NUMBER,
        Number.POSITIVE_INFINITY,
        Number.MAX_SAFE_INTEGER,
        Number.MAX_VALUE,
        NaN,
        '',
        '1234',
        new Date(2019, 11, 31),
        true,
        false,
        Symbol(),
        [],
        [99],
        {},
        {max: 99},
    ];

    const validsExclusive: any[] = [
        undefined,
        null,
        // 5:  this is the difference to Inclusive
        0,
        1,
        -1,
        4,
        4.99999999,
        Number.NEGATIVE_INFINITY,
        Number.MIN_SAFE_INTEGER,
        Number.MIN_VALUE,
    ];

    const invalidsExclusive = [
        5, // this is the difference to Inclusive
        5.0001,
        5 + VERY_SMALL_NUMBER,
        Number.POSITIVE_INFINITY,
        Number.MAX_SAFE_INTEGER,
        Number.MAX_VALUE,
        NaN,
        '',
        '1234',
        new Date(2019, 11, 31),
        true,
        false,
        Symbol(),
        [],
        [99],
        {},
        {max: 99},
    ];

    testBuilder('Max', 'value', TestClassMaxInclusive, {max: 5, inclusive: true})
        .build(validsInclusive, invalidsInclusive);
    testBuilder('Max', 'value', TestClassMaxExclusive, {max: 5, inclusive: false})
        .build(validsExclusive, invalidsExclusive);
    testBuilder('Max', 'value', TestClassWithContext, {max: 5, inclusive: true})
        .buildWithContext('invalid', {should: 'propagate to error'});

});
