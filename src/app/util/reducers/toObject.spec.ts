import {toObject} from './toObject';

describe('toObject', () => {
    class Foo {
        constructor(
            public readonly key: string | null | undefined,
            public readonly value: string
        ) {
        }
    }

    function mk(...entries: Array<[string | null | undefined, string]>): Foo[] {
        return entries.map(e => new Foo(e[0], e[1]));
    }

    it('should return an empty object on empty input', () => {
        const actual = ([] as Foo[])
            .reduce(toObject(v => v.key), {});

        expect(actual)
            .toEqual({});
    });

    it('should return a single entry on single-entry input', () => {
        const actual = mk(['hello', 'world'])
            .reduce(toObject(v => v.key), {});

        expect(actual)
            .toEqual({hello: new Foo('hello', 'world')});
    });

    it('should skip values with null or undefined key', () => {
        const actual = mk(
            ['hello', 'world'],
            [null, 'null-key'],
            [undefined, 'undefined-key'],
            ['welcome', 'stranger'])
            .reduce(toObject(v => v.key), {});

        expect(actual)
            .toEqual({
                hello: new Foo('hello', 'world'),
                welcome: new Foo('welcome', 'stranger')
            });
    });

    it('should select the last value for a duplicate key', () => {
        const actual = mk(
            ['hello', 'world'],
            ['hello', 'stranger'],
            ['happy', 'halloween'],
            ['happy', 'new year'])
            .reduce(toObject(v => v.key), {});

        expect(actual)
            .toEqual({
                hello: new Foo('hello', 'stranger'),
                happy: new Foo('happy', 'new year')
            });
    });
});
