import { Validator } from "../validators"
import { authRegistry } from "../validators/auth"
import { bodyRegistry } from "../validators/body"
import { ConsumedRequest } from "../common/request"
import { validate } from "./validation"
import * as _ from "lodash"
import { Wrapped } from "../common/wrappers"

export function altValidate<
    BR extends bodyRegistry,
    AR extends authRegistry,
    T
>(
    previousValidation: ConsumedRequest<T>,
    validators: _.RecursiveArray<Wrapped<any>>,
    bodyRegistry: BR,
    authRegistry: AR,
    crntIdx: number
): {
    consumedRequest: ConsumedRequest<T>
    nextIdx: number
    newLevel: _.RecursiveArray<Wrapped<any>>
} {
    //helper
    function collapse<A>(a: A | _.RecursiveArray<A>): A {
        if (!Array.isArray(a)) return a
        return _.flattenDeep(a)[0]
    }

    if (previousValidation.healthy) {
        const relevantValidators = validators.map(collapse)
        for (const idx in relevantValidators) {
            if (relevantValidators[idx]._tag !== "validator")
                return {
                    consumedRequest: { ...previousValidation, healthy: true },
                    nextIdx: crntIdx + 1,
                    newLevel: validators,
                } // if the first element of the level is a Label or Controller, a healthy validation is returned.

            const newValidation = validate(previousValidation).with(
                relevantValidators[idx].value,
                bodyRegistry
            )
            if (newValidation.healthy)
                return {
                    consumedRequest: newValidation,
                    nextIdx: 1,
                    newLevel: Array.isArray(validators[idx])
                        ? (validators[idx] as _.RecursiveArray<Wrapped<any>>)
                        : validators,
                }

            return {
                consumedRequest: { ...previousValidation, healthy: false },
                nextIdx: crntIdx + 1,
                newLevel: validators,
            }
        }
    }

    //base case; validation has already failed.
    return {
        consumedRequest: previousValidation,
        nextIdx: crntIdx + 1,
        newLevel: validators,
    }
}

// [  <>  ,  [   <>  ,  <>  ]  ]
// [  <>  ,  <*>  ]
