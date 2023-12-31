import { ConsumedRequest } from "../common/request.consumed"
import { validate } from "./validation"
import * as _ from "lodash"
import { TaggedMatcher, TaggedController } from "../common/tagged.types"
import { Matcher } from "../matchers"
import { BodyRegistry } from "../common/bodyRegistry.types"

export function altValidate<BR extends BodyRegistry, T>(
    previousValidation: ConsumedRequest<T>,
    validators: _.RecursiveArray<
        TaggedMatcher<Matcher<BR>> | TaggedController<any>
    >,
    bodyRegistry: BR,
    crntIdx: number
): {
    consumedRequest: ConsumedRequest<T>
    nextIdx: number
    newLevel: _.RecursiveArray<
        TaggedMatcher<Matcher<BR>> | TaggedController<any>
    >
} {
    //helper
    function collapse<A>(a: A | _.RecursiveArray<A>): A {
        if (!Array.isArray(a)) return a
        return _.flattenDeep(a)[0]
    }

    if (previousValidation.healthy) {
        const relevantValidators = validators.map(collapse)
        for (const idx in relevantValidators) {
            if (relevantValidators[idx]._tag == "Controller")
                return {
                    consumedRequest: {
                        ...previousValidation,
                        healthy: true,
                        controller: (
                            relevantValidators[idx] as TaggedController<string>
                        ).label,
                    },
                    nextIdx: crntIdx + 1,
                    newLevel: validators,
                } // if the first element of the level is a Controller, a healthy validation is returned.

            const newValidation = validate(previousValidation).with(
                (relevantValidators[idx] as TaggedMatcher<any>).value,
                bodyRegistry
            )
            if (newValidation.healthy)
                return {
                    consumedRequest: newValidation,
                    nextIdx: 1,
                    newLevel: Array.isArray(validators[idx])
                        ? (validators[idx] as _.RecursiveArray<
                              TaggedMatcher<Matcher<BR>> | TaggedController<any>
                          >)
                        : validators,
                }

            return {
                consumedRequest: {
                    ...previousValidation,
                    healthy: false,
                    error: newValidation.error,
                },
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
