import { Validator } from "../validators"
import { authRegistry } from "../validators/auth"
import { bodyRegistry } from "../validators/body"
import { altValidate } from "./altValidate"
import { chainValidate } from "./chainValidate"
import { ConsumedRequest, RequestT } from "./request"
import * as _ from "lodash"
/**
 * Recursivelly consume route applying either chain or alt validation.
 */
export function consumeRoute<BR extends bodyRegistry, AR extends authRegistry>(
    request: RequestT,
    validators: _.RecursiveArray<Validator<BR, AR>>,
    bodyRegistry: BR,
    authRegistry: AR
): object | false {
    //helpers
    function isValue(
        a: Validator<BR, AR> | _.RecursiveArray<Validator<BR, AR>>
    ): a is Validator<BR, AR> {
        return !Array.isArray(a)
    }
    function concatValidations<A, B>(
        prev: ConsumedRequest<A>,
        next: ConsumedRequest<B>
    ): ConsumedRequest<A & B> {
        return { ...next, consumed: { ...prev.consumed, ...next.consumed } }
    }

    //initialization
    let level: _.RecursiveArray<Validator<BR, AR>> = validators
    let crntIdx: number = 0
    let validation: ConsumedRequest<object> = {
        ...request,
        consumed: {},
        healthy: true,
    }

    //loop
    while (validation.healthy && crntIdx < level.length) {
        if (isValue(level[crntIdx])) {
            const { consumedRequest, nextIdx } = chainValidate(
                validation,
                level[crntIdx] as Validator<BR, AR>,
                bodyRegistry,
                authRegistry,
                crntIdx
            )
            validation = concatValidations(validation, consumedRequest)
            crntIdx = nextIdx
        } else {
            const { consumedRequest, nextIdx, newLevel } = altValidate(
                validation,
                level[crntIdx] as _.RecursiveArray<Validator<BR, AR>>,
                bodyRegistry,
                authRegistry,
                crntIdx
            )
            validation = concatValidations(validation, consumedRequest)
            crntIdx = nextIdx
            level = newLevel
        }
    }

    if (validation.healthy) return validation.consumed
    else return false
}
