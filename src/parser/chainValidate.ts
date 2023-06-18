import { Validator } from "../validators"
import { authRegistry } from "../validators/auth"
import { bodyRegistry } from "../validators/body"
import { ValidationResult } from "./validationResult"

declare function validate<BR extends bodyRegistry, AR extends authRegistry>(
    pending: string
): {
    with: (validator: Validator<BR, AR>) => {
        pending: string | false
        newProps: object
    }
}

export function chainValidate<BR extends bodyRegistry, AR extends authRegistry>(
    previousValidationResult: ValidationResult<BR, AR>,
    validator: Validator<BR, AR>
): ValidationResult<BR, AR> {
    let { pending, consumed, level, crntIdx, br, ar } = previousValidationResult

    if (!pending) return previousValidationResult //base case; validation has already failed

    const newValidationResult = validate<BR, AR>(pending).with(validator)
    pending = newValidationResult.pending
    consumed = { ...consumed, ...newValidationResult.newProps }
    //level = level ...unchanged
    crntIdx++ //what the next index will be if it exists

    return { pending, consumed, level, crntIdx, br, ar }
}
