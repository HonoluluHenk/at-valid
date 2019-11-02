import {testBuilder} from '../../../tests/test-builder.spec';
import {IsString} from './IsString';

describe('IsString', () => {
    class TestClass {
        @IsString()
        public value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    class TestClassWithContext {
        @IsString({customContext: {should: 'be passed to result'}})
        public value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    const valids = [
        undefined,
        null,
        '',
        'Hello World',
    ];

    const invalids = [
        {},
        new Date(2019, 11, 31),
        [],
        ['asdf'],
        true,
        false,
        Symbol(),
        0,
        NaN,
        -1,
    ];

    testBuilder(
        'IsString',
        'value',
        TestClass
    )
        .build(valids, invalids);

    testBuilder(
        'IsString',
        'value',
        TestClassWithContext
    )
        .buildWithContext(-1, {should: 'be passed to result'});
});
