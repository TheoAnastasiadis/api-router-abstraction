import { ConsumedRequest, RequestT } from "../common/request.consumed"
import { validate } from "./validation"
import { TaggedMatcher, TaggedController } from "../common/tagged.types"
import { Matcher } from "../matchers"
import { BodyRegistry } from "../common/bodyRegistry.types"

export function chainValidate<BR extends BodyRegistry, T>(
    previousValidation: ConsumedRequest<T>,
    validator: TaggedMatcher<Matcher<BR>> | TaggedController<any>,
    bodyRegistry: BR,
    crntIdx: number
): { consumedRequest: ConsumedRequest<T>; nextIdx: number } {
    let newValidation: ConsumedRequest<T>

    if (validator._tag == "Controller")
        return {
            consumedRequest: {
                ...previousValidation,
                healthy: true,
                controller: (validator as TaggedController<string>).label,
            },
            nextIdx: crntIdx + 1,
        }

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
