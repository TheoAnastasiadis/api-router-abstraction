import { Validator } from "."
import { ConsumedRequest, RequestT } from "../parser/request"
import { authRegistry } from "./auth"
import { bodyRegistry } from "./body"
import { returnObject } from "./returnObject"

export interface ValidatorI<
    V extends Validator<BR, AR>,
    BR extends bodyRegistry = {},
    AR extends authRegistry = {}
> {
    is: (val: string) => val is V
    consume: (
        request: RequestT,
        validator: V
    ) => ConsumedRequest<returnObject<BR, AR, V>>
}
