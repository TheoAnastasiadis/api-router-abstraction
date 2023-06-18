import * as _ from "lodash"
import { Validator } from "../validators"
import { authRegistry } from "../validators/auth"
import { bodyRegistry } from "../validators/body"
import { altValidate } from "./altValidate"
import { chainValidate } from "./chainValidate"
import { ValidationResult } from "./validationResult"

/**
 * Recursivelly consume route applying either chain or alt validation.
 */
export function consumeRoute<BR extends bodyRegistry, AR extends authRegistry>(
    validation: ValidationResult<BR, AR>
): object | false {
    //===HELPERS===//

    /**
     * Checks if the argument is a singe value or an array
     */
    function isValue<T>(a: T | _.RecursiveArray<T>): a is T {
        return !Array.isArray(a)
    }

    /**
     * Checks if the validation can continue. For the validation process to be able to continue there needs to be a truthy `pending` value and also the length of the current level needs to be larger than the current index.
     */
    function canContinue(v: ValidationResult<BR, AR>): boolean {
        return !!v.pending && v.level.length > v.crntIdx
    }

    const { pending, level, crntIdx } = validation

    let validationResult: ValidationResult<BR, AR>

    const crntNode = level[crntIdx]
    if (isValue(crntNode)) {
        //crntNode is Validator<BR,AR>
        validationResult = chainValidate(validation, crntNode)
    } else {
        //crntNode is _.RecursiveArray<Validator<BR,AR>>
        validationResult = altValidate(validation, crntNode)
    }

    if (canContinue(validationResult))
        return consumeRoute(validationResult) //recursive call
    else if (pending)
        return validationResult.consumed //if pending is still truthy
    else return false //if pending is not truthy
}
