import {testBuilder} from '../../../tests/test-builder.spec';
import {Matches} from './Matches';

describe('Matches', () => {

    class TestClassWithStringPattern {
        @Matches('^Hello World$')
        value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    class TestClassWithRegExp {
        @Matches(/^Hello World$/)
        value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    class TestClassWithMessageArgs {
        @Matches(/^Hello World$/, {weSay: 'Woot!'})
        value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    class TestClassWithContext {
        @Matches(/^Hello World$/, undefined, {customContext: {should: 'be passed to result'}})
        value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    const valids = [
        undefined,
        null,
        'Hello World',
    ];

    const invalids = [
        '',
        'no, sir!',
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

    describe('using string pattern', () => {
        testBuilder(
                'Matches',
                'value',
                TestClassWithStringPattern,
                {pattern: '^Hello World$'}
        )
                .build(valids, invalids);
    });

    describe('using RegExp', () => {
        testBuilder(
                'Matches',
                'value',
                TestClassWithRegExp,
                {pattern: /^Hello World$/}
        )
                .build(valids, invalids);
    });

    describe('custom messageArgs', () => {
        testBuilder(
                'Matches',
                'value',
                TestClassWithMessageArgs,
                {weSay: 'Woot!'}
        )
                .build(valids, invalids);
    });

    describe('context passing', () => {
        testBuilder(
                'Matches',
                'value',
                TestClassWithContext,
                {pattern: /^Hello World$/}
        )
                .buildWithContext('invalid', {should: 'be passed to result'});
    });
});
