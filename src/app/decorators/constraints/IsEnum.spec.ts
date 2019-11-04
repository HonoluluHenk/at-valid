import {testBuilder} from '../../../tests/test-builder.spec';
import {IsEnum} from './IsEnum';

describe('IsEnum', () => {

    enum IndexedEnum {
        foo,
        bar
    }

    enum StringEnum {
        hello = 'hello',
        kitty = 'kitty'
    }

    const invalidTypes = [
        {},
        '',
        'asdf',
        new Date(2019, 11, 31),
        [],
        ['asdf'],
        true,
        false,
        Symbol(),
        -1,
        0.5,
    ];

    describe('index enum', () => {
        const validsIndexed = [
            undefined,
            null,
            IndexedEnum.foo,
            IndexedEnum.bar,
            0,
            1,
        ];

        const invalidIndexed = [
            StringEnum.hello,
            StringEnum.kitty,
            'banana',
            '0',
            ...invalidTypes,
        ];

        class TestIndexedEnum {
            @IsEnum(IndexedEnum)
            value: any;

            constructor(value: any) {
                this.value = value;
            }
        }

        testBuilder(
            'IsEnum',
            'value',
            TestIndexedEnum,
            {enumClass: IndexedEnum}
        )
            .build(validsIndexed, invalidIndexed);

    });

    describe('string enum', () => {
        class TestStringEnumEnum {
            @IsEnum(StringEnum)
            value: any;

            constructor(value: any) {
                this.value = value;
            }
        }

        const validsString = [
            undefined,
            null,
            StringEnum.hello,
            StringEnum.kitty,
        ];

        const invalidStrings = [
            IndexedEnum.foo,
            IndexedEnum.bar,
            0,
            1,
            '0',
            '1',
            ...invalidTypes,
        ];

        testBuilder(
            'IsEnum',
            'value',
            TestStringEnumEnum,
            {enumClass: StringEnum}
        )
            .build(validsString, invalidStrings);

    });

    describe('passing context', () => {
        class TestClassWithContext {
            @IsEnum(StringEnum, {customContext: {should: 'be passed to result'}})
            value: any;

            constructor(value: any) {
                this.value = value;
            }
        }

        testBuilder(
            'IsEnum',
            'value',
            TestClassWithContext,
            {enumClass: StringEnum}
        )
            .buildWithContext('invalid', {should: 'be passed to result'});
    });
});
