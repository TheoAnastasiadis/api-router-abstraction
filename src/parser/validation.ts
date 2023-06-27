import { Matcher } from "../matchers"
import { MethodValidator } from "../validators/method.validator"
import { ParamValidator } from "../validators/param.validator"
import { QueryValidator } from "../validators/query.validator"
import {
    ConsumedRequest,
    ParsingErrors,
    RequestT,
} from "../common/request.consumed"
import { BodyValidator } from "../validators/body.validator"
import { BodyRegistry } from "../common/bodyRegistry.types"

export const validate = <BR extends BodyRegistry>(
    request: ConsumedRequest<any>
) => ({
    with: (validator: Matcher<BR>, bodyRegistry: BR) => {
        let result: ConsumedRequest<any>
        if (ParamValidator.is(validator, bodyRegistry)) {
            result = ParamValidator.consume(request, validator, bodyRegistry)
        } else if (QueryValidator.is(validator, bodyRegistry)) {
            result = QueryValidator.consume(request, validator, bodyRegistry)
        } else if (MethodValidator.is(validator, bodyRegistry)) {
            result = MethodValidator.consume(request, validator, bodyRegistry)
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
