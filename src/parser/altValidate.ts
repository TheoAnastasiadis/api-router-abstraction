import { Validator } from "../validators"
import { authRegistry } from "../validators/auth"
import { bodyRegistry } from "../validators/body"
import { ValidationResult } from "./validationResult"
import * as _ from "lodash"

declare function validate<BR extends bodyRegistry, AR extends authRegistry>(
    pending: string
): {
    with: (validator: Validator<BR, AR>) => {
        pending: string | false
        newProps: object
    }
}

export function altValidate<BR extends bodyRegistry, AR extends authRegistry>(
    previousValidationResult: ValidationResult<BR, AR>,
    validators: _.RecursiveArray<Validator<BR, AR>>
): ValidationResult<BR, AR> {
    //===HELPERS===//
    /**
     * Collapses an infinetelly nested array into its first value.
     * @example collapse([[['a'],'b','c'],'d']) == 'a'
     */
    function collapse<T>(a: _.RecursiveArray<T>): T {
        return _.flattenDeep(a)[0]
    }

    let { pending, consumed, level, crntIdx, br, ar } = previousValidationResult

    if (!pending) return previousValidationResult //base case 1; validation has already failed

    const collapsedValidators = validators.map((child) =>
        collapse(child as _.RecursiveArray<Validator<BR, AR>>)
    )
    const compatibleValidator = _.findIndex(
        collapsedValidators,
        (v) => !!validate(pending as string).with(v).pending
    )

    if (compatibleValidator == -1)
        return { pending: false, consumed, level, crntIdx, br, ar } //base case 2; no passable validator found

    const newValidationResult = validate(pending).with(
        collapsedValidators[compatibleValidator]
    )
    pending = newValidationResult.pending
    consumed = { ...consumed, ...newValidationResult.newProps }
    level = validators[compatibleValidator] as _.RecursiveArray<
        Validator<BR, AR>
    > //moving one level down
    crntIdx = 1 //the index of the next element if it exists

    return { pending, consumed, level, crntIdx, br, ar }
}
