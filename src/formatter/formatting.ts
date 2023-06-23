import { ConsumedResponse } from "../common/response"
import { Matcher } from "../matchers"
import { bodyRegistry } from "../matchers/body"
import { authRegistry } from "../matchers/auth"
import { returnObject } from "../returnObjects"
import { BodyValidator } from "../validators/body.validator"
import { MethodValidator } from "../validators/method.validator"
import { ParamValidator } from "../validators/param.validator"
import { QueryValidator } from "../validators/query.validator"

export const format = <BR extends bodyRegistry, AR extends authRegistry>(
    response: ConsumedResponse
) => ({
    with: (
        matcher: Matcher<BR, AR>,
        data: Record<string, any>,
        bodyRegistry: BR
    ) => {
        let result: ConsumedResponse
        if (ParamValidator.is(matcher)) {
            result = ParamValidator.format(data, matcher, response)
        } else if (QueryValidator.is(matcher)) {
            result = QueryValidator.format(data, matcher, response)
        } else if (MethodValidator.is(matcher)) {
            result = MethodValidator.format(data, matcher, response)
        } else if (BodyValidator.is(matcher, bodyRegistry) && data.body) {
            result = BodyValidator.format(
                data as Record<string, any> &
                    returnObject<BR, AR, `${keyof BR & string}_body`>,
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
