import {DEFAULT_GROUP} from '../decorators';
import {parseGroups} from './parseGroups';

describe('parseGroup', () => {
    it(`should parse undefined group`, () => {
        const actual = parseGroups(undefined);

        expect(actual)
            .toEqual([DEFAULT_GROUP]);
    });

    it(`should parse null group`, () => {
        const actual = parseGroups(null);

        expect(actual)
            .toEqual([DEFAULT_GROUP]);
    });

    it(`should parse empty group`, () => {
        const actual = parseGroups([]);

        expect(actual)
            .toEqual([]);
    });

    it(`should parse one group`, () => {
        const actual = parseGroups('testing');

        expect(actual)
            .toEqual(['testing']);
    });

    it(`should parse one group array`, () => {
        const actual = parseGroups(['testing']);

        expect(actual)
            .toEqual(['testing']);
    });

    it(`should parse multiple group`, () => {
        const actual = parseGroups(['foo', 'bar', 'baz']);

        expect(actual)
            .toEqual(['foo', 'bar', 'baz']);
    });
});
