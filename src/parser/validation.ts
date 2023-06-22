import { Validator } from "../validators"
import { authRegistry } from "../matchers/auth"
import { BodyT, BodyValidator, bodyRegistry } from "../validators/body"
import { MethodValidator } from "../validators/method"
import { ParamValidator } from "../validators/param"
import { QueryValidator } from "../validators/query"
import { ConsumedRequest, RequestT } from "../common/request"

export const validate = <BR extends bodyRegistry, AR extends authRegistry>(
    request: RequestT
) => ({
    with: (validator: Validator<BR, AR>, bodyRegistry: BR) => {
        let result: ConsumedRequest<any>
        if (ParamValidator.is(validator)) {
            result = ParamValidator.consume(request, validator)
        } else if (QueryValidator.is(validator)) {
            result = QueryValidator.consume(request, validator)
        } else if (MethodValidator.is(validator)) {
            result = MethodValidator.consume(request, validator)
        } else if (BodyValidator.is(validator, bodyRegistry)) {
            result = BodyValidator.consume(request, validator, bodyRegistry)
        } else {
            result = { ...request, consumed: {}, healthy: false }
        }

        return {
            ...request,
            path: result.path,
            method: result.method,
            consumed: result.consumed,
            healthy: result.healthy,
        } satisfies ConsumedRequest<object>
    },
})
