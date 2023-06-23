import { ConsumedRequest, RequestT } from "../common/request"
import { ConsumedResponse } from "../common/response"
import { Matcher } from "../matchers"
import { AuthT, authRegistry } from "../matchers/auth"
import { BodyT, bodyRegistry } from "../matchers/body"
import { returnObject } from "../returnObjects"

export interface ValidatorI<M extends Matcher<any, any>> {
    is: <BR extends bodyRegistry, AR extends authRegistry>(
        val: string,
        bodyRegistry?: BR,
        authRegistry?: AR
    ) => val is M extends BodyT<any> ? BodyT<BR> : M
    consume: <BR extends bodyRegistry, AR extends authRegistry>(
        request: RequestT,
        validator: M,
        bodyRegistry?: BR,
        authRegistry?: AR
    ) => ConsumedRequest<any>
    format: <
        const BR extends bodyRegistry,
        const AR extends authRegistry,
        const m extends M extends BodyT<any> ? BodyT<BR> : M
    >(
        data: Record<string, any> & returnObject<BR, AR, m>,
        matcher: m,
        response: ConsumedResponse
    ) => ConsumedResponse
}
