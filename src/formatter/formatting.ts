import { BodyRegistry } from "../common/bodyRegistry.types"
import { ConsumedResponse } from "../common/response.consumed"
import { Matcher } from "../matchers"
import { returnObject } from "../returnObjects"
import { BodyValidator } from "../validators/body.validator"
import { MethodValidator } from "../validators/method.validator"
import { ParamValidator } from "../validators/param.validator"
import { QueryValidator } from "../validators/query.validator"

export const format = <BR extends BodyRegistry>(
    response: ConsumedResponse
) => ({
    with: (matcher: Matcher<BR>, data: Record<string, any>, br: BR) => {
        let result: ConsumedResponse
        if (ParamValidator.is(matcher, br)) {
            result = ParamValidator.format(data, matcher, response)
        } else if (QueryValidator.is(matcher, br)) {
            result = QueryValidator.format(data, matcher, response)
        } else if (MethodValidator.is(matcher, br)) {
            result = MethodValidator.format(data, matcher, response)
        } else if (BodyValidator.is(matcher, br) && data.body) {
            result = BodyValidator.format(
                data as Record<string, any> &
                    returnObject<BR, `${keyof BR & string}_body`>,
                matcher,
                response
            )
        } else {
            result = response
        }

        return {
            ...response,
            body: result.body,
            path: result.path,
            method: result.method,
        } satisfies ConsumedResponse
    },
})
