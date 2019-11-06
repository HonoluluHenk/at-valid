import {testBuilder} from '../../../tests/test-builder.spec';
import {IsIn} from './IsIn';

/**
 * Wraps the Javscript/Typescript &quot;in&quot; operator.
 */
describe(`IsIn`, () => {
    const typedValues = [
        {
            allowedValues: [],
            valids: [undefined, null],
            invalids: [0, 1, -1, 'a', [], {}, Symbol(), () => 42]
        },
        {
            allowedValues: [1],
            valids: [undefined, null, 0],
            invalids: [1, -1, 'a', [], {}, Symbol(), () => 42]
        },
        {
            allowedValues: ['Hello World', 'Foobar'],
            valids: [undefined, null, 0, 1],
            invalids: [-1, 'a', [], {}, Symbol(), () => 42]
        },
        {
            allowedValues: {},
            valids: [undefined, null],
            invalids: [-1, 'a', [], {}, Symbol(), () => 42]
        },
        {
            allowedValues: {hello: 'world', foo: 'bar'},
            valids: [undefined, null, 'hello', 'foo'],
            invalids: [0, 1, -1, 'a', [], {}, Symbol(), () => 42]
        },
    ];

    typedValues.forEach((typedValue, idx) => {
        describe(`allowedValues #${idx}: ${JSON.stringify(typedValue.allowedValues)}`, () => {
            class TestClass {
                @IsIn(typedValue.allowedValues)
                value: any;

                constructor(value: any) {
                    this.value = value;
                }
            }

            testBuilder(
                'IsIn',
                'value',
                TestClass,
                {allowedValues: typedValue.allowedValues}
            )
                .build(typedValue.valids, typedValue.invalids);

        });

    });

    describe('passing context', () => {
        class TestClassWithContext {
            @IsIn(['Haystack'], {customContext: {should: 'be passed to result'}})
            value: any;

            constructor(value: any) {
                this.value = value;
            }
        }

        testBuilder(
            'IsIn',
            'value',
            TestClassWithContext,
            {allowedValues: ['Haystack']}
        )
            .buildWithContext('hammer', {should: 'be passed to result'});
    });

});
