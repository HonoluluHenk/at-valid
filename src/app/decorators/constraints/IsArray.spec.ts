import {testBuilder} from '../../../tests/test-builder.spec';
import {IsArray} from './IsArray';

describe('IsArray', () => {
    class TestClass {
        @IsArray()
        value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    class TestClassWithContext {
        @IsArray({customContext: {should: 'propagate to error'}})
        value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    const valids = [
        null,
        undefined,
        [],
        [1, 2, 3],
        ['asdf', 'fdsa'],
        [{}],
    ];

    const invalids = [
        '',
        'Hello World',
        0,
        1,
        NaN,
        {},
        new Date(),
    ];

    describe('without context', () => {
        testBuilder('IsArray', 'value', TestClass)
            .build(valids, invalids);
    });

    describe('with context', () => {
        testBuilder('IsArray', 'value', TestClassWithContext)
            .buildWithContext('invalid', {should: 'propagate to error'});
    });

});
