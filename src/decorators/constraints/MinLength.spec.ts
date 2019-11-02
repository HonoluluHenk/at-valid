import {testBuilder} from '../../../tests/test-builder.spec';
import {MinLength} from './MinLength';

describe('MinLength', () => {
    class TestClass {
        @MinLength(5)
        public value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    class TestClassWithContext {
        @MinLength(5, {customContext: {should: 'propagate to error'}})
        public value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    const valids = [
        undefined,
        null,
        '12345',
        'Hello World',
    ];

    const invalids = [
        '',
        '1234',
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

    testBuilder('MinLength', 'value', TestClass, {min: 5})
        .build(valids, invalids);
    testBuilder('MinLength', 'value', TestClassWithContext, {min: 5})
        .buildWithContext('bad', {should: 'propagate to error'});

});
