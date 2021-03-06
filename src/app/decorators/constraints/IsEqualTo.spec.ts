import {testBuilder} from '../../../tests/test-builder.spec';
import {IsEqualTo} from './IsEqualTo';

describe(`IsEqualTo`, () => {
    const typedValues = [
        {reference: 1, invalids: [-1, 'a', [], {}, Symbol(), () => 42]},
        {reference: 'Hello World', invalids: [-1, 'a', [], {}, Symbol(), () => 42]},
        {reference: [], invalids: [-1, 'a', [], {}, Symbol(), () => 42]},
        {reference: {}, invalids: [-1, 'a', [], {}, Symbol(), () => 42]},
        {reference: undefined, invalids: [-1, 'a', [], {}, Symbol(), () => 42]},
        {reference: null, invalids: [-1, 'a', [], {}, Symbol(), () => 42]},
    ];

    typedValues.forEach(typedValue => {
        describe(`reference: ${typedValue.reference}`, () => {
            class TestClass {
                @IsEqualTo(typedValue.reference)
                value: any;

                constructor(value: any) {
                    this.value = value;
                }
            }

            testBuilder(
                'IsEqualTo',
                'value',
                TestClass,
                {reference: typedValue.reference}
            )
                .build([typedValue.reference], typedValue.invalids);

        });

    });

    describe('passing context', () => {
        class TestClassWithContext {
            @IsEqualTo('Some funny text', {customContext: {should: 'be passed to result'}})
            value: any;

            constructor(value: any) {
                this.value = value;
            }
        }

        testBuilder(
            'IsEqualTo',
            'value',
            TestClassWithContext,
            {reference: 'Some funny text'}
        )
            .buildWithContext('invalid', {should: 'be passed to result'});
    });

});
