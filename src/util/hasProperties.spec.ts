import {hasProperties} from './hasProperties';

describe(`hasProperties`, () => {
    describe('an empty object', () => {
        it(`should not have properties`, () => {
            expect(hasProperties({}))
                .toEqual(false);
        });
    });

    describe('an object with properties', () => {
       it ('should have properties', () => {
           const actual = hasProperties({asdf: ''});

           expect(actual)
               .toEqual(true);
       });
    });
});
