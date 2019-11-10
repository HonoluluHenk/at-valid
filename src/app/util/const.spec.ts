import {DEFAULT_GROUP} from './const';

describe('const', () => {
    it(`should prevent typos`, () => {
        expect(DEFAULT_GROUP)
            .toEqual('DEFAULT');
    });
});
