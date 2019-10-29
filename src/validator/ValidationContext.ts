/**
 * The default validation group.
 */
export const DEFAULT_GROUP = "DEFAULT";

/**
 * Allows for passing data per validator-usage.
 * This data is also passed to the validator function (where it could be modified and then on to the final validator
 * result. It can therefore be used in the error messages.
 */
export interface CustomContext {
	[key: string]: any
}

export type ValidatorFn<V, T extends object = object> =
		(value: V | undefined | null, ctx: ValidatorFnContext, targetInstance: T)
				=> boolean | PromiseLike<boolean>;

export interface RuntimeValidatorConfigMap {
	[key: string]: RuntimeValidatorConfig[]
}

export interface ValidatorFnContext {
	readonly args: object,
	readonly customContext: CustomContext
}

/**
 * a normalized and validated view of {@link PropertyValidator}
 */
export class RuntimeValidatorConfig {
	constructor(
			public readonly name: string,
			public readonly propertyKey: string,
			public readonly target: object,
			public readonly validatorFn: ValidatorFn<any>,
			public readonly validatorFnContext: ValidatorFnContext,
			public readonly groups: string[],
	) {
	}

	public cloneValidatorFnContext(): ValidatorFnContext {
		return JSON.parse(JSON.stringify(this.validatorFnContext));
	}
}

export interface PropertyValidator<V> {
	/**
	 * The name of this validator.
	 * Most commonly this is the name of the annotation (e.g.: Required, MinLength, ...).
	 */
	name: string;
	/**
	 * Which property is being validated.
	 */
	propertyKey: string,
	/**
	 * The class where the property is located.
	 */
	target: object;
	/**
	 * The actual function that does the validation.
	 */
	validatorFn: ValidatorFn<V>
	//FIXME: document
	opts: Opts | undefined
	/**
	 * If your validator function needs arguments (e.g.: the min-length of a string), provide them here.
	 */
	messageArgs?: object | undefined;
}

export interface Opts {
	/**
	 * Validation group(s) this validator belongs to, defaults to {@link  DEFAULT_GROUP}.
	 */
	groups?: string | string[]
	/**
	 * Some more custom customContext information for your validator function, also passed through to the error message.
	 */
	customContext?: CustomContext;
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
	private readonly validatorsPerClass: Map<object, RuntimeValidatorConfigMap> = new Map();

	public registerPropertyValidator<V>(
			params: PropertyValidator<V>
	): number {
		// console.log('registerPropertyValidatio called: ', params);

		const opts = params.opts || {};

		const validator = new RuntimeValidatorConfig(
				required(params.name, "name/class"),
				required(params.propertyKey, "propertyKey"),
				required(params.target, "target"),
				required(params.validatorFn, "validatorFn"),
				{args: (params.messageArgs || {}), customContext: opts.customContext || {}},
				(typeof opts.groups === 'string' ? [opts.groups] : opts.groups) || [DEFAULT_GROUP],
		);

		if (typeof validator.propertyKey === 'symbol') {
			throw Error(`Symbols not supported (target: ${validator.target}@${validator.propertyKey})`);
		}

		// console.debug('registering validator: ', validator);
		this.putValidator(validator);

		return 0;
	}

	public getValidatorsForClass(object: object): RuntimeValidatorConfigMap {
		return this.validatorsPerClass.get(object.constructor) || {};
	}

	private putValidator(validator: RuntimeValidatorConfig): void {
		const allForClass = this.validatorsPerClass.get(validator.target.constructor) || {};
		let allForProp = allForClass[validator.propertyKey] || [];

		allForProp = [validator, ...allForProp];
		allForClass[validator.propertyKey] = allForProp;

		this.validatorsPerClass.set(validator.target.constructor, allForClass);
	}
}

function required<T>(value: T | null | undefined, description: string): T {
	if (value === null || value === undefined) {
		throw Error(`${description} required`);
	}

	return value;
}