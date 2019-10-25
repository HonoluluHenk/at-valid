import {DecoratorValidator} from './DecoratorValidator';
import {CustomContext, ValidationContext} from './ValidationContext';

describe('DecoratorValidator', () => {
	describe('A validator that is modifying the context', () => {
		let invocation = 0;

		beforeEach(() => {
			invocation = 0;
		});

		function DecoratorThatModifiesCustomContext(context: CustomContext): any {
			return (target: object, propertyKey: string) => {
				ValidationContext.instance.registerPropertyValidator({
					name: 'DecoratorThatModifiesCustomContext',
					target,
					propertyKey,
					validatorFn: (value, ctx) => {
						invocation++;
						if (ctx.customContext.contextProperty !== 'contextPropertyValue') {
							fail(`context.contextProperty changed before the invocation (#${invocation}):
expected: contextPropertyValue
actual  : ${ctx.customContext.contextProperty}`);
						}
						ctx.customContext.contextProperty = 'changed';

						if (ctx.customContext.addedInValidator) {
							fail(`the value of context.addedInValidator has been added before this invocation (#${invocation})`);
						}
						ctx.customContext.addedInValidator = 'addedInValidator';

						return true;
					},
					context
				});
			};
		}

		class Foo {
			@DecoratorThatModifiesCustomContext({contextProperty: 'contextPropertyValue'})
			public property = 'Hello World'
		}

		it('should not see the modification on second invocation', () => {
			expect(() => new DecoratorValidator().validate(new Foo()))
					.not.toThrow();
			expect(() => new DecoratorValidator().validate(new Foo()))
					.not.toThrow();
			// other expectations are in the validatorFn
		})
	});
});