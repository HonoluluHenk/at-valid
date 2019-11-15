import {CustomConstraint, IsNumber, Matches, Min, MinLength, Required} from '../app/decorators';
import {isEmpty} from '../app/util/isEmpty';
import {CustomFailure, DecoratorValidator, Opts, ValidateParams, ValidationContext} from '../app/validator';

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

    describe('CustomConstraint', () => {
        class ClassUsingCustomConstraint {
            @CustomConstraint(
                'MyValidator',
                theValue => isEmpty(theValue) || theValue === 'Wanted: Dead or Alive',
                {hello: 'world'}
            )
            value?: string;
        }

        it('should produce an error-message using your parameters', async () => {
            const fixture = new ClassUsingCustomConstraint();
            fixture.value = 'hiding in the darkness';

            const actual = await new DecoratorValidator().validate(fixture);

            expect(JSON.parse(JSON.stringify(actual)))
                .toEqual({
                    success: false,
                    propertyErrors: {
                        value: {
                            propertyKey: 'value',
                            value: 'hiding in the darkness',
                            path: '$.value',
                            validatorName: 'MyValidator',
                            validatorFnContext: {
                                args: {hello: 'world'},
                                customContext: {}
                            }
                        }
                    }
                });
        });
    });

    describe('My own decorator', () => {
        function FavoriteMovieCharacter(movie: string, opts?: Opts) {
            const movies: { [movie: string]: string } = {
                'Blade Runner': 'Deckard',
                'Dune': 'Chani'
            };

            function isValid(value: any): boolean {
                return isEmpty(value) || movies[movie] === value;
            }

            return (target: object, propertyKey: string) => {
                ValidationContext.instance.registerPropertyValidator({
                    // make sure the name does not clash with other validators (see below)
                    name: 'FavoriteMovieCharacter',
                    messageArgs: {movie},
                    target,
                    propertyKey,
                    validatorFn: value => isValid(value),
                    opts
                });
            };
        }

        class MovieStars {
            @FavoriteMovieCharacter('Blade Runner')
            star: string = '';
        }

        it('should pass name+args to the error message', async () => {
            const fixture = new MovieStars();
            fixture.star = 'Jar Jar Binks';

            const actual = await new DecoratorValidator().validate(fixture);

            expect(JSON.parse(JSON.stringify(actual)))
                .toEqual(
                    {
                        success: false,
                        propertyErrors: {
                            star: {
                                propertyKey: 'star',
                                path: '$.star',
                                value: 'Jar Jar Binks',
                                validatorName: 'FavoriteMovieCharacter',
                                validatorFnContext: {args: {movie: 'Blade Runner'}, customContext: {}}
                            }
                        }
                    }
                );
        });
    });

    describe('CustomContext', () => {
        class CustomContextTester {
            @Required({customContext: {additionalInfo: 'we reeeeeeeally need this value!'}})
            value?: string;

            constructor(value?: string) {
                this.value = value;
            }
        }

        it('should get passed to the error message', async () => {
            const fixture = new CustomContextTester();

            const error = await new DecoratorValidator().validate(fixture);

            expect(JSON.parse(JSON.stringify(error)))
                .toEqual(
                    {
                        success: false,
                        propertyErrors: {
                            value: {
                                propertyKey: 'value',
                                path: '$.value',
                                validatorName: 'Required',
                                validatorFnContext: {
                                    args: {},
                                    customContext: {additionalInfo: 'we reeeeeeeally need this value!'}
                                }
                            }
                        }
                    }
                );

            // if (error.isError && error.propertyErrors.value) {
            //     console.log(error.propertyErrors.value.validatorFnContext.customContext.additionalInfo);
            // }
        });
    });

    describe('CustomContext modifies args', () => {
        function FavoriteMovie(movie: string, opts?: Opts) {

            function isValid(value: any): boolean | CustomFailure {
                if (isEmpty(value) || value === movie) {
                    return true;
                }

                return {
                    messageArgs: {
                        // we're rewriting the attribute from the definition here!
                        movie: value,
                        whyItSucked: 'because of Jar Jar Binks!'
                    }
                };
            }

            return (target: object, propertyKey: string) => {
                ValidationContext.instance.registerPropertyValidator({
                    // make sure the name does not clash with other validators (see below)
                    name: 'FavoriteMovie',
                    messageArgs: {movie},
                    target,
                    propertyKey,
                    validatorFn: value => isValid(value),
                    opts
                });
            };
        }

        class MyMovies {
            @FavoriteMovie('Blade Runner')
            name: string = '';
        }

        it('should extend the error message args', async () => {
            const fixture = new MyMovies();
            fixture.name = 'The Phantom Menace';

            const actual = await new DecoratorValidator().validate(fixture);

            expect(JSON.parse(JSON.stringify(actual)))
                .toEqual(
                    {
                        success: false,
                        propertyErrors: {
                            name: {
                                propertyKey: 'name',
                                path: '$.name',
                                value: 'The Phantom Menace',
                                validatorName: 'FavoriteMovie',
                                validatorFnContext:
                                    {
                                        args: {
                                            movie: 'The Phantom Menace',
                                            whyItSucked: 'because of Jar Jar Binks!'
                                        },
                                        customContext: {}
                                    }
                            }
                        }
                    }
                );
        });
    });

    describe('groups', () => {

        class GroupTesting {
            @Matches(/Apples/, undefined, {groups: ['FIRST']})
            @Matches(/Apples|Oranges/, undefined, {groups: ['SECOND']})
            @Matches(/Bananas/, undefined, {groups: ['THIRD']})
            value: string;

            constructor(value: string) {
                this.value = value;
            }
        }

        const validate = async (fixture: any, opts: ValidateParams) =>
            new DecoratorValidator().validate(fixture, opts);

        it('should show the testcase: Apple, FIRST', async () => {
            const result = await validate(new GroupTesting('Apples'), {groups: ['FIRST']});

            expect(result.isSuccess)
                .toEqual(true);
        });

        it('should show the testcase: Apple, SECOND', async () => {
            const result = await validate(new GroupTesting('Apples'), {groups: ['SECOND']});

            expect(result.isSuccess)
                .toEqual(true);
        });

        //FIXME
        it('should show the testcase: Oranges, FIRST', async () => {
            const result = await validate(new GroupTesting('Oranges'), {groups: ['FIRST']});

            expect(result.isSuccess)
                .toEqual(false);
        });

        it('should show the testcase: Oranges, SECOND', async () => {
            const result = await validate(new GroupTesting('Oranges'), {groups: ['SECOND']});

            expect(result.isSuccess)
                .toEqual(true);
        });

        it("should show the testcase: Apples, ['FIRST', 'SECOND', 'THIRD']", async () => {
            const result = await validate(new GroupTesting('Apples'), {groups: ['FIRST', 'SECOND', 'THIRD']});

            expect(result.isSuccess)
                .toEqual(false);
        });

        it("should show the testcase: Oranges, ['FIRST', 'SECOND', 'THIRD']", async () => {
            const result = await validate(new GroupTesting('Oranges'), {groups: ['FIRST', 'SECOND', 'THIRD']});

            expect(result.isSuccess)
                .toEqual(false);
        });

        it('should show the testcase: Foobar []', async () => {
            const result = await validate(new GroupTesting('Foobar'), {groups: []});

            expect(result.isSuccess)
                .toEqual(true);
        });
    });
});
