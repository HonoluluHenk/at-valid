import {IsNumber} from '../app/decorators/constraints/IsNumber';
import {Min} from '../app/decorators/constraints/Min';
import {MinLength} from '../app/decorators/constraints/MinLength';
import {Required} from '../app/decorators/constraints/Required';
import {DecoratorValidator} from '../app/validator/DecoratorValidator';

/* tslint:disable:member-access */
describe('ExamplesForReadme', () => {
    describe('Basic property validation', () => {
        class MyClass {
            // some optional property that - if there is a value - needs a minimum length of 3
            @MinLength(3)
            optionalProperty?: string;

            // this property is required and must evaluate to a number with a value >= 5
            @Required()
            @IsNumber()
            @Min(5)
            someValueFromAPI?: any;
        }

        it('should work as expected', async () => {
            const fixture = new MyClass();

            const actual = await new DecoratorValidator().validate(fixture);

            expect(actual.isSuccess)
                .toEqual(false);

            // console.log(JSON.stringify(actual));

            // we want to have JSON representation here since that's whats documented in README.md
            expect(JSON.parse(JSON.stringify(actual)))
                .toEqual(
                    {
                        success: false,
                        propertyErrors: {
                            someValueFromAPI: {
                                propertyKey: 'someValueFromAPI',
                                path: '$.someValueFromAPI',
                                validatorName: 'Required',
                                validatorFnContext: {args: {}, customContext: {}}
                            }
                        }
                    }
                );

        });
    });
});
