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
export const ALL_GROUPS = [];

/**
 * Allows for passing data per validator-usage.
 * This data is also passed to the validator function (where it could be modified and then on to the final validator
 * result. It can therefore be used in the error messages.
 */
export interface CustomContext {
	[key: string]: any
}

//FIXME: do not forget to add context from register*() function to the ultimate ValidationError subclass

export type ValidatorFn<V, T extends object = object> =
		(value: V | undefined | null, target: T, opts: CustomContext)
				=> boolean;

export type AsyncValidatorFn<V, T = object> =
		(value: V | undefined | null, target: T, opts: CustomContext)
				=> Promise<boolean>;

export interface RuntimePropertyValidatorMap {
	[key: string]: RuntimePropertyValidator[]
}

/**
 * a normalized and validated view of {@link PropertyValidator}
 */
export class RuntimePropertyValidator {
	constructor(
			public readonly name: string,
			public readonly propertyKey: string/* | symbol*/,
			public readonly target: object,
			public readonly validatorFn: ValidatorFn<any>/*|AsyncValidatorFn<V>*/,
			public readonly validatorFnArgs: any[],
			public readonly messageOverride: string,
			public readonly groups: string[],
			public readonly customContext: CustomContext
	) {
	}
}

export interface PropertyValidator<V> {
	/**
	 * The name of this validator.
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
	target: object;
	/**
	 * The actual function that does the validation.
	 */
	//FIXME: async
	validatorFn: ValidatorFn<V>/*|AsyncValidatorFn<V>*/
	;
	/**
	 * If your validator function needs arguments (e.g.: the min-length of a string), provide them here.
	 */
	args?: any[];
	/**
	 * Allow overriding the default message.
	 */
	messageOverride?: string;
	/**
	 * Validation group(s) this validator belongs to, defaults to {@link  DEFAULT_GROUP}.
	 */
	groups?: string | string[]
	/**
	 * Some more custom context information for your validator function, also passed through to the error message.
	 */
	context?: CustomContext;
}

export class ValidationContext {

	public static get instance() {
		return this._instance;
	}

	public static readonly _instance: ValidationContext = new ValidationContext();

	/**
	 * ClassOrName -&gt; (propertyName -&gt; Validation).
	 * "propertyName" is either
	 * <ul>
	 *     <li>a property (for normal property validators)</li>
	 *     <li>"constructor" (for class validators)</li>
	 * </ul>
	 */
	private readonly validatorsPerClass: Map<object, RuntimePropertyValidatorMap> = new Map();

	public registerPropertyValidator<V>(
			opts: PropertyValidator<V>
	): number {
		// console.log('registerPropertyValidatio called: ', opts);

		const validator: RuntimePropertyValidator = {
			name: required(opts.name, "name/class"),
			propertyKey: required(opts.propertyKey, "propertyKey"),
			target: required(opts.target, "target"),
			validatorFn: required(opts.validatorFn, "validatorFn"),
			validatorFnArgs: opts.args || [],
			messageOverride: opts.messageOverride || "",
			groups: (typeof opts.groups === 'string' ? [opts.groups] : opts.groups) || [DEFAULT_GROUP],
			customContext: opts.context || {} as CustomContext
		};

		// console.debug('registering validator: ', validator);
		this.putValidator(validator);

		return 0;
	}

	public getValidatorsForClass(object: object): RuntimePropertyValidatorMap {
		return this.validatorsPerClass.get(object.constructor) || {};
	}

	private putValidator(validator: RuntimePropertyValidator): void {
		const forClass = this.validatorsPerClass.get(validator.target.constructor) || {};
		const forProp = forClass[validator.propertyKey] || [];

		forProp.push(validator);
		forClass[validator.propertyKey] = forProp;

		this.validatorsPerClass.set(validator.target.constructor, forClass);
	}
}

function required<T>(value: T | null | undefined, description: string): T {
	if (value === null || value === undefined) {
		throw Error(`${description} required`);
	}

	return value;
}