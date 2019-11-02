import {testBuilder} from '../../../tests/test-builder.spec';
import {IsNumber} from './IsNumber';

describe('IsNumber', () => {
    class TestClass {
        @IsNumber()
        public value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    class TestClassWithContext {
        @IsNumber({customContext: {should: 'be passed to result'}})
        public value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    const valids = [
        undefined,
        null,
        0,
        -0,
        1,
        -1,
        0.5,
        -0.5,
        Number.MAX_SAFE_INTEGER,
        Number.MAX_VALUE,
        Number.MIN_VALUE,
        Number.MIN_SAFE_INTEGER,
        Number.EPSILON,
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
    ];

    const invalids = [
        {},
        '',
        'asdf',
        new Date(2019, 11, 31),
        [],
        ['asdf'],
        true,
        false,
        Symbol(),
    ];

    testBuilder(
        'IsNumber',
        'value',
        TestClass
    )
        .build(valids, invalids);

    testBuilder(
        'IsNumber',
        'value',
        TestClassWithContext
    )
        .buildWithContext('invalid', {should: 'be passed to result'});
});
