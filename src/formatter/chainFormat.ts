import { ConsumedResponse } from "../common/response.consumed"
import { Matcher } from "../matchers"
import { returnObject } from "../returnObjects"
import { TaggedController, TaggedMatcher } from "../common/tagged.types"
import { format } from "./formatting"
import { BodyRegistry } from "../common/bodyRegistry.types"

export function chainFormat<BR extends BodyRegistry>(
    previousFormatting: ConsumedResponse,
    matcher: TaggedController<any> | TaggedMatcher<Matcher<BR>>,
    data: Record<string, any>,
    bodyRegistry: BR,
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
