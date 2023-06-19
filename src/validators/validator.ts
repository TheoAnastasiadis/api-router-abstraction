import { Validator } from "."
import { ConsumedRequest, RequestT } from "../parser/request"
import { authRegistry } from "./auth"
import { bodyRegistry } from "./body"
import { returnObject } from "./returnObject"

export interface ValidatorI<V extends Validator<any, any>> {
    is: <BR extends bodyRegistry, AR extends authRegistry>(
        val: string,
        bodyRegistry?: BR,
        authRegistry?: AR
    ) => val is Validator<BR, AR>
    consume: <BR extends bodyRegistry, AR extends authRegistry>(
        request: RequestT,
        validator: V,
        odyRegistry?: BR,
        authRegistry?: AR
    ) => ConsumedRequest<returnObject<BR, AR, Validator<BR, AR>>>
}
