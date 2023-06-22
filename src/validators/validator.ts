import { Validator } from "."
import { ConsumedRequest, RequestT } from "../common/request"
import { authRegistry } from "./auth"
import { BodyT, bodyRegistry } from "./body"
import { returnObject } from "./returnObject"

export interface ValidatorI<T extends Validator<any, any>> {
    is: <BR extends bodyRegistry, AR extends authRegistry>(
        val: string,
        bodyRegistry?: BR,
        authRegistry?: AR
    ) => val is T extends BodyT<any> ? BodyT<BR> : T
    consume: <BR extends bodyRegistry, AR extends authRegistry>(
        request: RequestT,
        validator: T extends BodyT<any> ? BodyT<BR> : T,
        bodyRegistry?: BR,
        authRegistry?: AR
    ) => ConsumedRequest<
        T extends BodyT<any>
            ? returnObject<BR, AR, Validator<BR, AR>>
            : returnObject<BR, AR, T>
    >
}
