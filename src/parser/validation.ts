import { Matcher } from "../matchers"
import { authRegistry } from "../matchers/auth"
import { bodyRegistry } from "../matchers/body"
import { MethodValidator } from "../validators/method.validator"
import { ParamValidator } from "../validators/param.validator"
import { QueryValidator } from "../validators/query.validator"
import {
    ConsumedRequest,
    ParsingErrors,
    RequestT,
} from "../common/request.consumed"
import { BodyValidator } from "../validators/body.validator"

export const validate = <BR extends bodyRegistry, AR extends authRegistry>(
    request: ConsumedRequest<any>
) => ({
    with: (validator: Matcher<BR, AR>, bodyRegistry: BR) => {
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
            result = {
                ...request,
                consumed: {},
                healthy: false,
                error: ParsingErrors.UNKNOWN_ERROR,
            }
        }

        switch (result.healthy) {
            case true:
                return {
                    ...request,
                    path: result.path,
                    method: result.method,
                    consumed: result.consumed,
                    healthy: true as const,
                }
                break

            default:
                return {
                    ...request,
                    path: result.path,
                    method: result.method,
                    consumed: result.consumed,
                    healthy: false as const,
                    error: result.error,
                }
                break
        }
    },
})
