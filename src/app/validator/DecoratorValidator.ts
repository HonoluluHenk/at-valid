import {DEFAULT_GROUP} from '../util/const';
import {toObject} from '../util/reducers/toObject';
import {CustomFailure, PropertyValidator, ValidationContext, ValidatorFnContext} from './ValidationContext';
import {ValidationError, ValidationResult} from './ValidationResult';

type ValidationOutcome = boolean | CustomFailure;

export interface ValidateParams {
    groups?: string[];
}

export class DecoratorValidator {

    /**
     * Execution ordering:
     * iterate over groups
     * for each group: iterate over targetInstance propertyValidators
     * for each property inside group: executeValidator each validator
     * for current group: if no property validation error occured: executeValidator each class-validator
     *
     * @param targetInstance the object instance to executeValidator the validations on.
     * @param params Configure validation behavior
     */
    async validate(targetInstance: object, params?: ValidateParams): Promise<ValidationResult> {
        const validParams = parseParams(params);

        return validateImpl(targetInstance, validParams, '$');
    }
}

async function validateImpl(
    targetInstance: object,
    params: Required<ValidateParams>,
    instancePath: string
): Promise<ValidationResult> {
    const groupPlans = ValidationContext.instance.buildExecutionPlan(targetInstance, params.groups);

    for (const group of Object.keys(groupPlans.groups)) {
        const groupPlan = groupPlans.groups[group];
        const validatorPromises: Array<Promise<ValidationError | undefined>> = Object.keys(groupPlan.propertyValidators)
            .map(
                propertyKey => runValidators(
                    groupPlan.targetInstance,
                    groupPlan.propertyValidators[propertyKey],
                    instancePath,
                    (nestedTargetIntance, nestedPath) => validateImpl(nestedTargetIntance, params, nestedPath)
                ));

        const validationResult = await Promise.all(validatorPromises)
            .then(groupResults => groupResults.filter(x => !!x) as ValidationError[])
            .then((groupResults: ValidationError[]) =>
                ValidationResult.create(groupResults.reduce(toObject(x => x!.propertyKey), {}), undefined)
            );

        if (validationResult.isError) {
            return Promise.resolve(validationResult);
        }
    }

    return Promise.resolve(ValidationResult.success());

}

function appendPath(parentPath: string, childPath: string) {
    return [parentPath, childPath].join('.');
}

function mapToValidationError(
    outcome: ValidationOutcome,
    value: any,
    validator: PropertyValidator,
    validatorFnContext: ValidatorFnContext,
    instancePath: string,
    childValidation: ValidationResult | undefined
): ValidationError | undefined {

    let ok: boolean;
    let customFailure: CustomFailure = {messageArgs: undefined};

    if (typeof outcome === 'boolean') {
        ok = outcome;
    } else {
        // CustomFailure
        ok = false;
        customFailure = outcome;
    }

    if (ok) {
        return undefined;
    }

    const path = appendPath(instancePath, validator.propertyKey);

    const result: ValidationError = {
        propertyKey: validator.propertyKey,
        value,
        path,
        validatorName: validator.name,
        validatorFnContext: {
            customContext: validatorFnContext.customContext,
            args: {
                ...validatorFnContext.args,
                ...customFailure.messageArgs
            }
        }
    };

    // is there a prettier way of having this attribute added only if it's != undefined
    // instead of having it allways added with the undefined value?
    if (childValidation) {
        return {
            ...result,
            childValidation
        };
    }

    return result;
}

async function runValidators(
    targetInstance: object,
    validators: PropertyValidator[],
    instancePath: string,
    nestedHandler: (nestedTargetIntance: object, instancePath: string) => Promise<ValidationResult | undefined>
): Promise<ValidationError | undefined> {
    for (const rcv of validators.values()) {
        const err = await executeValidator(targetInstance, rcv, instancePath, nestedHandler);
        if (err) {
            return Promise.resolve(err);
        }
    }

    return Promise.resolve(undefined);
}

async function executeValidator(
    targetInstance: object,
    validator: PropertyValidator,
    instancePath: string,
    nestedHandler: (nestedTargetIntance: object, instancePath: string) => Promise<ValidationResult | undefined>
): Promise<ValidationError | undefined> {

    let success: ValidationOutcome | PromiseLike<ValidationOutcome>;
    let childValidation: ValidationResult | undefined;

    const value: any = (targetInstance as any)[validator.propertyKey];
    if (validator.validatorFn === 'NESTED') {
        const nestedTarget = value;
        if (nestedTarget) {
            childValidation = await nestedHandler(nestedTarget, appendPath(instancePath, validator.propertyKey));
            success = !!childValidation && childValidation.isSuccess;
        } else {
            success = true;
        }
    } else {
        success = validator.validatorFn(value, validator.validatorFnContext, targetInstance);
    }

    let promise: Promise<ValidationOutcome>;

    if (success instanceof Promise) {
        promise = success;
    } else {
        promise = Promise.resolve(success);
    }

    return promise
        .then(ok =>
            mapToValidationError(ok, value, validator, validator.validatorFnContext, instancePath, childValidation));

}

function parseParams(params: ValidateParams | undefined): Required<ValidateParams> {
    return {
        groups: (params || {}).groups || [DEFAULT_GROUP]
    };
}
