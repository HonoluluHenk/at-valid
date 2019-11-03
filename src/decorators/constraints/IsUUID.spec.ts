import {testBuilder} from '../../../tests/test-builder.spec';
import {IsUUID} from './IsUUID';

describe('IsUUID', () => {
    class TestClassV4 {
        @IsUUID()
        public value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    class TestClassV1 {
        @IsUUID(1)
        public value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    class TestClassWithContext {
        @IsUUID(undefined, {customContext: {should: 'be passed to result'}})
        public value: any;

        constructor(value: any) {
            this.value = value;
        }
    }

    const invalidTypes = [
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

    const validsV4 = [
        undefined,
        null,
        '09bb1d8c-4965-4788-94f7-31b151eaba4e',
    ];

    const invalidsV4 = [
        '23d57c30-afe7-11e4-ab7d-12e3f512a338', // V1
        ...invalidTypes,
    ];

    const validsV1 = [
        '23d57c30-afe7-11e4-ab7d-12e3f512a338',
    ];

    const invalidsV1 = [
        '09bb1d8c-4965-4788-94f7-31b151eaba4e', // V4
        ...invalidTypes,
    ];

    describe('UUIDv4', () => {
        testBuilder(
            'IsUUID',
            'value',
            TestClassV4
        )
            .build(validsV4, invalidsV4);
    });

    describe('UUIDv1', () => {
        testBuilder(
            'IsUUID',
            'value',
            TestClassV1
        )
            .build(validsV1, invalidsV1);
    });

    describe('passing context', () => {
        testBuilder(
            'IsUUID',
            'value',
            TestClassWithContext
        )
            .buildWithContext(-1, {should: 'be passed to result'});
    });
});
