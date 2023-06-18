import { Validator } from "../validators"
import { authRegistry } from "../validators/auth"
import { bodyRegistry } from "../validators/body"
import { ConsumedRequest, RequestT } from "./request"

export const validate = <BR extends bodyRegistry, AR extends authRegistry>(request: RequestT) => ({
    with: (validator: Validator<BR,AR>) => {

        const {path, method, headers, cookies} = request
        let newPath: string, consumed: object

        if(ParamValidator.is(validator)) {
            const result = ParamValidator.consume(path)
            newPath = result.remainingPath
            consumed = result.consumed
        } else {
            newPath = ""
            consumed = {}
        }

        return {path: newPath, method, headers, cookies, consumed} satisfies ConsumedRequest
    }
})