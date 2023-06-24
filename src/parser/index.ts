import { Matcher } from "../matchers"
import { authRegistry } from "../matchers/auth"
import { bodyRegistry } from "../matchers/body"
import { altValidate } from "./altValidate"
import { chainValidate } from "./chainValidate"
import { ConsumedRequest, RequestT } from "../common/request"
import * as _ from "lodash"
import { TaggedController, TaggedMatcher } from "../common/wrappers"
/**
 * Recursivelly consume route applying either chain or alt validation.
 */
export function consumeRoute<BR extends bodyRegistry, AR extends authRegistry>(
    request: RequestT,
    validators: readonly [
        ..._.RecursiveArray<
            TaggedMatcher<Matcher<BR, AR>> | TaggedController<any>
        >
    ],
    bodyRegistry: BR,
    authRegistry: AR
): object | false {
    //helpers
    function isValue(
        a:
            | TaggedMatcher<Matcher<BR, AR>>
            | TaggedController<any>
            | _.RecursiveArray<
                  TaggedMatcher<Matcher<BR, AR>> | TaggedController<any>
              >
    ): a is TaggedMatcher<Matcher<BR, AR>> | TaggedController<any> {
        return !Array.isArray(a)
    }
    function concatValidations<A, B>(
        prev: ConsumedRequest<A>,
        next: ConsumedRequest<B>
    ): ConsumedRequest<A & B> {
        return { ...next, consumed: { ...prev.consumed, ...next.consumed } }
    }

    //initialization
    let level = validators
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
                level[crntIdx] as
                    | TaggedMatcher<Matcher<BR, AR>>
                    | TaggedController<any>,
                bodyRegistry,
                authRegistry,
                crntIdx
            )
            validation = concatValidations(validation, consumedRequest)
            crntIdx = nextIdx
        } else {
            const { consumedRequest, nextIdx, newLevel } = altValidate(
                validation,
                level[crntIdx] as _.RecursiveArray<
                    TaggedMatcher<Matcher<BR, AR>> | TaggedController<any>
                >,
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
