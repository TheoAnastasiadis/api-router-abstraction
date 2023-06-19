import { Validator } from "../validators"
import { authRegistry } from "../validators/auth"
import { bodyRegistry } from "../validators/body"
import { ConsumedRequest } from "./request"
import { validate } from "./validation"
import * as _ from "lodash"

export function altValidate<
    BR extends bodyRegistry,
    AR extends authRegistry,
    T
>(
    previousValidation: ConsumedRequest<T>,
    validators: _.RecursiveArray<Validator<BR, AR>>,
    bodyRegistry: BR,
    authRegistry: AR,
    crntIdx: number
): {
    consumedRequest: ConsumedRequest<T>
    nextIdx: number
    newLevel: _.RecursiveArray<Validator<BR, AR>>
} {
    function collapse<A>(a: A | _.RecursiveArray<A>): A {
        //helper
        if (!Array.isArray(a)) return a
        return _.flattenDeep(a)[0]
    }

    if (previousValidation.healthy) {
        const relevantValidators = validators.map(collapse)
        for (const idx in relevantValidators) {
            const newValidation = validate(previousValidation).with(
                relevantValidators[idx],
                bodyRegistry
            )
            if (newValidation.healthy)
                return {
                    consumedRequest: newValidation,
                    nextIdx: 1,
                    newLevel: Array.isArray(validators[idx])
                        ? (validators[idx] as _.RecursiveArray<
                              Validator<BR, AR>
                          >)
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

// [  <>  ,  [  <>  ,  <>  ]  ]
// [  <>  ,  <*>  ]
