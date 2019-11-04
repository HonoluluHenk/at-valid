import {testBuilder} from '../../../tests/test-builder.spec';
import {Required} from './Required';

describe('Required', () => {
    class TestClass {
        @Required()
        value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    class TestClassWithContext {
        @Required({customContext: {should: 'propagate to error'}})
        value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    const valids = [
        // please note: 'Required' is the only validator that does not have null/undefined as valid values!
        '',
        'Hello World',
        0,
        -0,
        1,
        NaN,
        [],
        {},
        new Date(),
    ];

    const invalids = [
        null,
        undefined,
    ];

    describe('without context', () => {
        testBuilder('Required', 'value', TestClass)
            .build(valids, invalids);
    });

    describe('with context', () => {
        testBuilder('Required', 'value', TestClassWithContext)
            .buildWithContext(undefined, {should: 'propagate to error'});
    });

});
