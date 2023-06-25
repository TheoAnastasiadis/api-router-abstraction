import { ConsumedResponse } from "../common/response.consumed"
import { TaggedMatcher, TaggedController } from "../common/tagged.types"
import { Matcher } from "../matchers"
import { authRegistry } from "../matchers/auth"
import { bodyRegistry } from "../matchers/body"
import { altFormat } from "./altFormat"
import { chainFormat } from "./chainFormat"

/**
 * Recursivelly consume route applying either chain or alt formatting.
 */
export function consumeFormatters<
    BR extends bodyRegistry,
    AR extends authRegistry
>(
    validators: readonly [
        ..._.RecursiveArray<
            TaggedMatcher<Matcher<BR, AR>> | TaggedController<any>
        >
    ],
    data: Record<string, any>,
    target: string,
    bodyRegistry: BR,
    authRegistry: AR
): ConsumedResponse {
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

    //initialization
    let level = validators
    let crntIdx: number = 0
    let formatting: ConsumedResponse = {
        path: "",
    }

    //loop
    while (crntIdx < level.length) {
        if (isValue(level[crntIdx])) {
            const { consumedResponse, nextIdx } = chainFormat(
                formatting,
                level[crntIdx] as
                    | TaggedMatcher<Matcher<BR, AR>>
                    | TaggedController<any>,
                data,
                bodyRegistry,
                authRegistry,
                crntIdx
            )
            formatting = consumedResponse
            crntIdx = nextIdx
        } else {
            const { consumedResponse, nextIdx, newLevel } = altFormat(
                formatting,
                level[crntIdx] as _.RecursiveArray<
                    | TaggedMatcher<Matcher<BR, AR>>
                    | TaggedController<any, string>
                >,
                target
            )
            formatting = consumedResponse
            crntIdx = nextIdx
            level = newLevel
        }
    }

    return formatting
}
