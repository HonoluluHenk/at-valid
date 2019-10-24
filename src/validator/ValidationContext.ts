
/* decorator functions
declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
declare type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
 */

/**
 * The default validation group.
 */
export const DEFAULT_GROUP = "DEFAULT";

/**
 * Allows for passing data per validation-definition.
 * This data is also passed to the validation function (where it could be modified and then on to the final validation result.
 * It can therefore be used in the error messages.
 */
export interface CustomContext {
	[key: string]: any
}

//FIXME: do not forget to add context from register*() function to the ultimate ValidationError subclass

export type ValidationFn<V, T extends object = Object> =
		(value: V | undefined | null, target: T, opts: CustomContext)
				=> boolean;

export type AsyncValidationFn<V, T = object> =
		(value: V | undefined | null, target: T, opts: CustomContext)
				=> Promise<boolean>;

export interface PropertyValidation<V> {
	/**
	 * The name of this validation.
	 * Most commonly this is the name of the annotation (e.g.: IsNotEmpty, MinLength, ...).
	 */
	name: string;
	/**
	 * Which property is being validated.
	 */
	// FIXME: | symbol
	propertyKey: string,
	/**
	 * The class where the property is located.
	 */
	target: Object;
	/**
	 * The actual function that does the validation.
	 */
	//FIXME: async
	validationFn: ValidationFn<V>/*|AsyncValidationFn<V>*/;
	/**
	 * If your validation function needs arguments (e.g.: the min-length of a string), provide them here.
	 */
	args?: any[];
	/**
	 * Allow overriding the default message.
	 */
	messageOverride?: string;
	/**
	 * Validation group(s) this validation belongs to, defaults to {@link  DEFAULT_GROUP}.
	 */
	group?: string | string[]
	/**
	 * Some more custom context information for your validation function, also passed through to the error message.
	 */
	context?: CustomContext;
}

const DEFAULT_PROPERTY_VALIDATION = {
	args: [],
	messageOverride: "",
	context: {},
	group: DEFAULT_GROUP
};

export class ValidationContext {

	private static _instance: ValidationContext = new ValidationContext();

	private readonly validatinsPerClass: Map<Object, Required<PropertyValidation<any>>[]> = new Map();

	public static get instance() {
		return this._instance;
	}

	public registerPropertyValidation<V>(
			opts: PropertyValidation<V>
	): number {
		// console.log('registerPropertyValidatio called: ', opts);

		const params: Required<PropertyValidation<any>> = {
			...DEFAULT_PROPERTY_VALIDATION,
			...opts
		};

		let existing = this.validatinsPerClass.get(opts.target) || [];
		// console.log('XXXXXXx registered for: ', opts.target.constructor);
		this.validatinsPerClass.set(opts.target.constructor, existing.concat(params));

		return 0;
	}

	public getValidationsForClass(object: Object): Required<PropertyValidation<any>>[] {
		// console.log('XXXXXXx get for: ', object.constructor);
		return this.validatinsPerClass.get(object.constructor) || [];
	}
}