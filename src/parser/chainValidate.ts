import { authRegistry } from "../matchers/auth"
import { bodyRegistry } from "../matchers/body"
import { ConsumedRequest, RequestT } from "../common/request"
import { validate } from "./validation"
import { TaggedMatcher, TaggedController } from "../common/wrappers"
import { Matcher } from "../matchers"

export function chainValidate<
    BR extends bodyRegistry,
    AR extends authRegistry,
    T
>(
    previousValidation: ConsumedRequest<T>,
    validator: TaggedMatcher<Matcher<BR, AR>> | TaggedController<any>,
    bodyRegistry: BR,
    authRegistry: AR,
    crntIdx: number
): { consumedRequest: ConsumedRequest<T>; nextIdx: number } {
    let newValidation: ConsumedRequest<T>

    if (validator._tag !== "Matcher")
        return { consumedRequest: previousValidation, nextIdx: crntIdx + 1 }

    switch (previousValidation.healthy) {
        case true:
            newValidation = validate(previousValidation).with(
                validator.value,
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
