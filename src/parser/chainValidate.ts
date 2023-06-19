import { Validator } from "../validators"
import { authRegistry } from "../validators/auth"
import { bodyRegistry } from "../validators/body"
import { ConsumedRequest, RequestT } from "./request"
import { validate } from "./validation"

export function chainValidate<
    BR extends bodyRegistry,
    AR extends authRegistry,
    T
>(
    previousValidation: ConsumedRequest<T>,
    validator: Validator<BR, AR>,
    bodyRegistry: BR,
    authRegistry: AR,
    crntIdx: number
): { consumedRequest: ConsumedRequest<T>; nextIdx: number } {
    let newValidation: ConsumedRequest<T>

    switch (previousValidation.healthy) {
        case true:
            newValidation = validate(previousValidation).with(
                validator,
                bodyRegistry
            )
            break

        case false:
            newValidation = previousValidation
            //base case; validation has already failed
            break
    }

    return { consumedRequest: newValidation, nextIdx: crntIdx + 1 }
}
