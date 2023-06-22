import { RequestT } from "../common/request"
import { BodyT, bodyRegistry } from "../matchers/body"
import { returnObject } from "../returnObjects"
import { ValidatorI } from "./validator.interface"
import * as t from "io-ts"

export const BodyValidator: ValidatorI<BodyT<any>> = {
    is<BR extends bodyRegistry>(
        val: string,
        bodyRegistry?: BR
    ): val is BodyT<BR> {
        const { validatorKey } = val.match(/(?<validatorKey>\w*?)_body/)
            ?.groups || { validatorKey: undefined }
        const registryKeys = Object.keys(bodyRegistry || {})

        return (
            !!bodyRegistry &&
            !!validatorKey &&
            registryKeys.includes(validatorKey)
        )
    },
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
