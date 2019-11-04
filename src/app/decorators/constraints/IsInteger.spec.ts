import {testBuilder} from '../../../tests/test-builder.spec';
import {IsInteger} from './IsInteger';

describe('IsInteger', () => {
    class TestClass {
        @IsInteger()
        value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    class TestClassWithContext {
        @IsInteger({customContext: {should: 'be passed to result'}})
        value: any;

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
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
        Number.MAX_VALUE, //TODO: is this correct?
    ];

    const invalids = [
        0.5,
        -0.5,
        0.0001,
        0.99999999,
        Number.MIN_VALUE,
        Number.EPSILON,
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
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
            'IsInteger',
            'value',
            TestClass
    )
            .build(valids, invalids);

    testBuilder(
            'IsInteger',
            'value',
            TestClassWithContext
    )
            .buildWithContext('invalid', {should: 'be passed to result'});
});
