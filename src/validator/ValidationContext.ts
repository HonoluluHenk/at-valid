/**
 * The default validation group.
 */
import {ValidatorNames} from '../decorators/ValidatorNames';
import {distinct} from '../util/filters/distinct';

export const DEFAULT_GROUP = 'DEFAULT';

/**
 * Allows for passing data per validator-usage.
 * This data is also passed to the validator function (where it could be modified and then on to the final validator
 * result. It can therefore be used in the error messages.
 */
export interface CustomContext {
    [key: string]: any;
}

export type ValidatorFn<V, T extends object = object> =
    (value: V | undefined | null, ctx: ValidatorFnContext, targetInstance: T)
        => boolean | PromiseLike<boolean>;

export type ValidatorFnLike<V, T extends object = object> = ValidatorFn<V, T> | 'NESTED';

export interface RuntimeValidatorConfigMap {
    [property: string]: PropertyValidator[];
}

export interface ValidatorFnContext {
    readonly args: object;
    readonly customContext: CustomContext;
}

/**
 * a normalized and validated view of {@link PropertyValidatorConfig}
 */
export interface PropertyValidator {
    readonly name: string;
    readonly propertyKey: string;
    readonly target: object;
    readonly validatorFn: ValidatorFnLike<any>;
    readonly validatorFnContext: ValidatorFnContext;
    readonly groups: string[];
}

export interface PropertyValidatorConfig<V> {
    /**
     * The name of this validator.
     * Most commonly this is the name of the annotation (e.g.: Required, MinLength, ...).
     */
    name: string;
    /**
     * Which property is being validated.
     */
    propertyKey: string;
    /**
     * The class where the property is located.
     */
    target: object;
    /**
     * The actual function that does the validation.
     */
    validatorFn: ValidatorFnLike<V>;
    //FIXME: document
    opts: Opts | undefined;
    /**
     * If your validator function needs arguments (e.g.: the min-length of a string), provide them here.
     */
    messageArgs?: object | undefined;
}

export interface Opts {
    /**
     * Validation group(s) this validator belongs to, defaults to {@link  DEFAULT_GROUP}.
     */
    groups?: string | string[];
    /**
     * Some more custom customContext information for your validator function, also passed through to the error message.
     */
    customContext?: CustomContext;
}

export interface NestedOpts {
    /**
     * Validation group(s) this validator belongs to, defaults to {@link  DEFAULT_GROUP}.
     */
    groups?: string | string[];
}

export interface NestedValidatorConfig {
    propertyKey: string;
    opts: NestedOpts | undefined;
    name: string;
    target: object;
}

export interface GroupPlan {
    targetInstance: object;
    propertyValidators: {
        [property: string]: PropertyValidator[],
    };
    //TODO:
    // classValidator?: ClassValidator
}

export interface ExecutionPlan {
    groups: {
        [group: string]: GroupPlan,
    };
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
        config: PropertyValidatorConfig<V>
    ) {
        // console.log('registerPropertyValidatio called: ', config);

        const opts = config.opts || {};

        const validator: PropertyValidator = {
            name: required(config.name, 'name/class'),
            propertyKey: required(config.propertyKey, 'propertyKey'),
            target: required(config.target, 'target'),
            validatorFn: required(config.validatorFn, 'validatorFn'),
            validatorFnContext: {args: (config.messageArgs || {}), customContext: opts.customContext || {}},
            groups: parseGroups(opts.groups)
        };

        if (typeof validator.propertyKey === 'symbol') {
            throw Error(`Symbols not supported (target: ${validator.target}@${validator.propertyKey})`);
        }

        // console.debug('registering validator: ', validator);
        this.putValidator(validator);
    }

    public registerNested(config: NestedValidatorConfig): void {

        const opts = config.opts || {};

        // *sigh*... cannot get the type of the nested property from the class definition,
        // we have to wait for an actual instance (i.e.: until the execution plan is generated).

        const validator: PropertyValidator = {
            name: ValidatorNames.Nested,
            propertyKey: required(config.propertyKey, 'propertyKey'),
            target: required(config.target, 'target'),
            validatorFn: 'NESTED',
            validatorFnContext: {args: {}, customContext: {}},
            groups: parseGroups(opts.groups)
        };

        this.putValidator(validator);

    }

    public getValidatorsForClass(object: object): RuntimeValidatorConfigMap {
        return this.validatorsPerClass.get(object.constructor) || {};
    }

    public buildExecutionPlan(targetInstance: object, groups: string[]): ExecutionPlan {

        const result: ExecutionPlan = {
            groups: {}
        };

        const executed: { [property: string]: PropertyValidator[] } = {};

        const validatorsByProperty = ValidationContext.instance.getValidatorsForClass(targetInstance);

        for (const group of groups) {
            const groupPlan: GroupPlan = {
                targetInstance,
                propertyValidators: {}
            };

            for (const propertyKey of Object.keys(validatorsByProperty)) {
                executed[propertyKey] = executed[propertyKey] || [];

                const validators: PropertyValidator[] = validatorsByProperty[propertyKey]
                    .filter(validator => validatorInGroup(validator, group))
                    .filter(validator => executed[propertyKey].indexOf(validator) < 0)
                    .filter(distinct());

                executed[propertyKey].push(...validators);

                groupPlan.propertyValidators[propertyKey] = validators;
            }

            result.groups[group] = groupPlan;
            //TODO: implement class validators
        }

        return result;
    }

    private putValidator(validator: PropertyValidator): void {
        const allForClass = this.validatorsPerClass.get(validator.target.constructor) || {};
        let allForProp = allForClass[validator.propertyKey] || [];

        allForProp = [validator, ...allForProp];
        allForClass[validator.propertyKey] = allForProp;

        this.validatorsPerClass.set(validator.target.constructor, allForClass);
    }
}

function parseGroups(groups?: string | string[]): string[] {
    return (typeof groups === 'string' ? [groups] : groups) || [DEFAULT_GROUP];
}

function validatorInGroup(validator: PropertyValidator, group: string): boolean {
    return validator.groups.indexOf(group) >= 0;
}

function required<T>(value: T | null | undefined, description: string): T {
    if (value === null || value === undefined) {
        throw Error(`${description} required`);
    }

    return value;
}
