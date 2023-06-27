import { BodyRegistry } from "../common/bodyRegistry.types"
import { ConsumedResponse } from "../common/response.consumed"
import { TaggedMatcher, TaggedController } from "../common/tagged.types"
import { Matcher } from "../matchers"
import { altFormat } from "./altFormat"
import { chainFormat } from "./chainFormat"

/**
 * Recursivelly consume route applying either chain or alt formatting.
 */
export function consumeFormatters<BR extends BodyRegistry>(
    validators: readonly [
        ..._.RecursiveArray<TaggedMatcher<Matcher<BR>> | TaggedController<any>>
    ],
    data: Record<string, any>,
    target: string,
    bodyRegistry: BR
): ConsumedResponse {
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
                    | TaggedMatcher<Matcher<BR>>
                    | TaggedController<any>,
                data,
                bodyRegistry,
                crntIdx
            )
            formatting = consumedResponse
            crntIdx = nextIdx
        } else {
            const { consumedResponse, nextIdx, newLevel } = altFormat(
                formatting,
                level[crntIdx] as _.RecursiveArray<
                    TaggedMatcher<Matcher<BR>> | TaggedController<string>
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
