import * as _ from "lodash"
import { ConsumedResponse } from "../common/response.consumed"
import { TaggedMatcher, TaggedController } from "../common/tagged.types"
import { Matcher } from "../matchers"
import { authRegistry } from "../matchers/auth"
import { bodyRegistry } from "../matchers/body"

export function altFormat<BR extends bodyRegistry, AR extends authRegistry, T>(
    previousFormatting: ConsumedResponse,
    validators: _.RecursiveArray<
        TaggedMatcher<Matcher<BR, AR>> | TaggedController<string>
    >,
    target: string
): {
    consumedResponse: ConsumedResponse
    nextIdx: number
    newLevel: _.RecursiveArray<
        TaggedMatcher<Matcher<BR, AR>> | TaggedController<string>
    >
} {
    //helper
    function collapse<A>(a: A | _.RecursiveArray<A>) {
        if (!Array.isArray(a)) return [a]
        return _.flattenDeep(a)
    }

    const newLevel = validators
        .map(collapse)
        .filter(
            (validatorArrays) =>
                validatorArrays.findIndex(
                    (v) => v._tag == "Controller" && v.label == target
                ) > -1
        )[0]

    return {
        consumedResponse: previousFormatting,
        nextIdx: 0,
        newLevel,
    }
}
