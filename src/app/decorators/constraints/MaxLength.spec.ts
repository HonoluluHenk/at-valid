import {testBuilder} from '../../../tests/test-builder.spec';
import {MaxLength} from './MaxLength';

describe('MaxLength', () => {
    class TestClass {
        @MaxLength(5)
        value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    class TestClassWithContext {
        @MaxLength(5, {customContext: {should: 'propagate to error'}})
        value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    const valids = [
        undefined,
        null,
        '',
        'a',
        '12345',
        [1],
        [1, 2, 3, 4, 5],
    ];

    const invalids = [
        '123456',
        '123456asdfasdfasdfasdf',
        {},
        0,
        1,
        -1,
        NaN,
        new Date(2019, 11, 31),
        true,
        false,
        Symbol(),
    ];

    testBuilder('MaxLength', 'value', TestClass, {max: 5})
        .build(valids, invalids);
    testBuilder('MaxLength', 'value', TestClassWithContext, {max: 5})
        .buildWithContext('invalid', {should: 'propagate to error'});
});
