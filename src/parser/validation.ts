import { Validator } from "../validators"
import { authRegistry } from "../validators/auth"
import { bodyRegistry } from "../validators/body"
import { ParamValidator } from "../validators/param"
import { ConsumedRequest, RequestT } from "./request"

export const validate = <BR extends bodyRegistry, AR extends authRegistry>(request: RequestT) => ({
    with: (validator: Validator<BR,AR>) => {

        let newPath : string
        let consumed: object
        let healthy: boolean = false
        if(ParamValidator.is(validator)) {
            const result = ParamValidator.consume(request, validator)
            newPath = result.path
            consumed = result.consumed
            healthy = result.healthy
        } else {
            newPath = ""
            consumed = {}
        }

        return {...request, path: newPath, consumed, healthy} satisfies ConsumedRequest<object>
    }
})