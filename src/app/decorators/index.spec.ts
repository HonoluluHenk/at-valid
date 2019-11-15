import {DEFAULT_GROUP} from '.';

describe('const', () => {
    it(`should prevent typos`, () => {
        expect(DEFAULT_GROUP)
            .toEqual('DEFAULT');
    });
});
