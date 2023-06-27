import { BodyRegistry } from "../common/bodyRegistry.types"
import { ConsumedRequest, RequestT } from "../common/request.consumed"
import { ConsumedResponse } from "../common/response.consumed"
import { Matcher } from "../matchers"
import { BodyT } from "../matchers/body"
import { returnObject } from "../returnObjects"

export interface ValidatorI<M extends Matcher<any>> {
    is: <BR extends BodyRegistry>(
        val: string,
        bodyRegistry: BR
    ) => val is M extends BodyT<any> ? BodyT<BR> : M
    consume: <BR extends BodyRegistry>(
        request: RequestT,
        validator: M,
        bodyRegistry: BR
    ) => ConsumedRequest<any>
    format: <
        const BR extends BodyRegistry,
        const m extends M extends BodyT<any> ? BodyT<BR> : M
    >(
        data: Record<string, any> & returnObject<BR, m>,
        matcher: m,
        response: ConsumedResponse
    ) => ConsumedResponse
}
