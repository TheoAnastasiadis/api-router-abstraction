import { Matcher } from "../matchers"
import { altValidate } from "./altValidate"
import { chainValidate } from "./chainValidate"
import {
    ConsumedRequest,
    ParsingErrors,
    RequestT,
} from "../common/request.consumed"
import * as _ from "lodash"
import { TaggedController, TaggedMatcher } from "../common/tagged.types"
import { Either } from "../common/either.types"
import { BodyRegistry } from "../common/bodyRegistry.types"

type Validators<BR extends BodyRegistry> = readonly [
    ..._.RecursiveArray<TaggedMatcher<Matcher<BR>> | TaggedController<any>>
]

/**
 * Recursivelly consume route applying either chain or alt validation.
 */
export function consumeRoute<BR extends BodyRegistry>(
    request: RequestT,
    validators: Validators<BR>,
    bodyRegistry: BR
): Either<ParsingErrors, { controller: string; consumed: object }> {
    //helpers
    function isValue(
        a:
            | TaggedMatcher<Matcher<BR>>
            | TaggedController<any>
            | _.RecursiveArray<
                  TaggedMatcher<Matcher<BR>> | TaggedController<any>
              >
    ): a is TaggedMatcher<Matcher<BR>> | TaggedController<any> {
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
            const result: {
                consumedRequest: ConsumedRequest<object>
                nextIdx: number
            } = chainValidate(
                validation,
                level[crntIdx] as
                    | TaggedMatcher<Matcher<BR>>
                    | TaggedController<any>,
                bodyRegistry,
                crntIdx
            )
            validation = concatValidations(validation, result.consumedRequest)
            crntIdx = result.nextIdx
        } else {
            const result: {
                consumedRequest: ConsumedRequest<object>
                nextIdx: number
                newLevel: Validators<BR>
            } = altValidate(
                validation,
                level[crntIdx] as _.RecursiveArray<
                    TaggedMatcher<Matcher<BR>> | TaggedController<any>
                >,
                bodyRegistry,
                crntIdx
            )
            validation = concatValidations(validation, result.consumedRequest)
            crntIdx = result.nextIdx
            level = result.newLevel
        }
    }

    if (validation.healthy && validation.controller)
        return {
            _tag: "Right",
            right: {
                controller: validation.controller,
                consumed: validation.consumed,
            },
        }
    else if (validation.healthy)
        return {
            _tag: "Left",
            left: ParsingErrors.UNKNOWN_ERROR, //parsing didn't conclude on a controller node
        }
    else
        return {
            _tag: "Left",
            left: validation.error,
        }
}
