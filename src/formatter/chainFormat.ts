import { ConsumedResponse } from "../common/response.consumed"
import { Matcher } from "../matchers"
import { authRegistry } from "../matchers/auth"
import { bodyRegistry } from "../matchers/body"
import { returnObject } from "../returnObjects"
import { TaggedController, TaggedMatcher } from "../common/tagged.types"
import { format } from "./formatting"

export function chainFormat<BR extends bodyRegistry, AR extends authRegistry>(
    previousFormatting: ConsumedResponse,
    matcher: TaggedController<any> | TaggedMatcher<Matcher<BR, AR>>,
    data: Record<string, any>,
    bodyRegistry: BR,
    authRegistry: AR,
    crntIdx: number
): { consumedResponse: ConsumedResponse; nextIdx: number } {
    let newFormatting: ConsumedResponse

    if (matcher._tag !== "Matcher")
        return { consumedResponse: previousFormatting, nextIdx: crntIdx + 1 }

    newFormatting = format(previousFormatting).with(
        matcher.value,
        data,
        bodyRegistry
    )

    return { consumedResponse: newFormatting, nextIdx: crntIdx + 1 }
}
