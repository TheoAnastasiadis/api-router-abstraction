import { BodyRegistry } from "../common/bodyRegistry.types"
import { ParsingErrors, RequestT } from "../common/request.consumed"
import { BodyT } from "../matchers/body"
import isBodyT from "../narrowers/isBodyT"
import { returnObject } from "../returnObjects"
import { ValidatorI } from "./validator.interface"
import * as t from "io-ts"

export const BodyValidator: ValidatorI<BodyT<any>> = {
    is: isBodyT,
    consume<BR extends BodyRegistry>(
        request: RequestT,
        validator: BodyT<BR>,
        bodyRegistry: BR
    ) {
        //request info
        const { body } = request
        //validator info
        const key = validator.replace("_body", "") as keyof BR
        if (typeof body == "undefined")
            return {
                ...request,
                consumed: {
                    body: {},
                } as returnObject<BR, typeof validator>,
                healthy: false,
                error: ParsingErrors.BODY_ERROR,
            }

        const decoded = bodyRegistry[key]["fields"].decode(body)
        if (decoded._tag == "Right")
            return {
                ...request,
                consumed: {
                    body: decoded.right satisfies t.TypeOf<
                        (typeof bodyRegistry)[typeof key]["fields"]
                    >,
                } as returnObject<BR, typeof validator>,
                healthy: true,
            }

        return {
            ...request,
            consumed: { body: {} } as returnObject<BR, typeof validator>,
            healthy: false,
            error: ParsingErrors.BODY_ERROR,
        }
    },
    format(data, matcher, response) {
        const { body } = data
        return { ...response, body }
    },
}
