import {testBuilder} from '../../../tests/test-builder.spec';
import {IsBoolean} from './IsBoolean';

describe('IsBoolean', () => {
    class TestClass {
        @IsBoolean()
        value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    class TestClassWithContext {
        @IsBoolean({customContext: {should: 'be passed to result'}})
        value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    const valids = [
        undefined,
        null,
        true,
        false,
    ];

    const invalids = [
        '',
        'Hello World',
        {},
        new Date(2019, 11, 31),
        [],
        ['asdf'],
        Symbol(),
        0,
        NaN,
        -1,
    ];

    testBuilder(
            'IsBoolean',
            'value',
            TestClass
    )
            .build(valids, invalids);

    testBuilder(
            'IsBoolean',
            'value',
            TestClassWithContext
    )
            .buildWithContext(-1, {should: 'be passed to result'});
});
