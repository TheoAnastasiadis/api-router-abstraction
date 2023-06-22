import { RequestT } from "../common/request"
import { BodyT, bodyRegistry } from "../matchers/body"
import isBodyT from "../narrowers/isBodyT"
import { returnObject } from "../returnObjects"
import { ValidatorI } from "./validator.interface"
import * as t from "io-ts"

export const BodyValidator: ValidatorI<BodyT<any>> = {
    is: isBodyT,
    consume<BR extends bodyRegistry>(
        request: RequestT,
        validator: BodyT<BR>,
        bodyRegistry?: BR
    ) {
        if (typeof bodyRegistry == "undefined")
            throw new TypeError("Argument `bodyregistry` must be provided")

        //request info
        const { body } = request
        //validator info
        const { key } = validator.match(/(?<key>\w*?)_body/)?.groups as {
            key: keyof typeof bodyRegistry
        }

        if (typeof body == "undefined")
            return {
                ...request,
                consumed: {
                    body: {},
                } as returnObject<BR, any, typeof validator>,
                healthy: true,
            }

        const decoded = bodyRegistry[key].decode(body)
        if (decoded._tag == "Right")
            return {
                ...request,
                consumed: {
                    body: decoded.right satisfies t.TypeOf<
                        (typeof bodyRegistry)[typeof key]
                    >,
                } as returnObject<BR, any, typeof validator>,
                healthy: true,
            }

        return {
            ...request,
            consumed: { body: {} } as returnObject<BR, any, typeof validator>,
            healthy: false,
        }
    },
}
