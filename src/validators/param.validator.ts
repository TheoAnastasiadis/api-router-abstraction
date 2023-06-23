import { RequestT } from "../common/request"
import { ParamT } from "../matchers/param"
import isParamT from "../narrowers/isParamT"
import { returnObject } from "../returnObjects"
import { ValidatorI } from "./validator.interface"
import * as _ from "lodash"

//helpers
function hasType(
    v: ParamT
): v is `/:${string}(${"string" | "number" | "boolean"})` {
    return v.startsWith("/:")
}

export const ParamValidator: ValidatorI<ParamT> = {
    is: isParamT,
    consume: (request: RequestT, validator: ParamT) => {
        //parse path info
        const { path } = request
        const { element, rest } = path.match(
            /\/(?<element>\w*)(?:(?<rest>[/?].*))?/
        )?.groups || { element: "", rest: "" }
        //parse validator info
        if (hasType(validator)) {
            // "/:id(number)"
            const { name, type } = validator.match(
                /\/(?::(?<name>\w*?)\((?<type>\w*?)\))/
            )?.groups || { name: "", type: "" }
            //initializations
            let consumed: returnObject<any, any, typeof validator> = {}
            let healthy = true
            switch (type) {
                case "number": // ex. "/:id(number)""
                    const num = Number(element)
                    if (isNaN(num)) healthy = false
                    else consumed = { [name]: num }
                    break

                case "boolean": // ex. "/:safe(boolean)""
                    const bool = element == "true"
                    healthy = element == "true" || element == "false"
                    consumed = { [name]: bool }
                    break

                default: // ex. "/:user(string)"
                    const str = element
                    healthy = str.length > 0
                    consumed = { [name]: str }
                    break
            }

            return { ...request, path: rest, consumed, healthy }
        } else {
            // ex. "/posts"
            const { name } = validator.match(/\/(?<name>\w*)/)?.groups || {
                name: "",
            }
            const healthy = element == name
            return { ...request, path: rest, consumed: {}, healthy }
        }
    },
    format(data, matcher, response) {
        let { path } = response

        if (hasType(matcher as ParamT)) {
            const { name } = matcher.match(/\/:(?<name>.*?)\(/)?.groups || {
                name: undefined,
            }

            if (!name) throw new TypeError(`Invalid ParamT matcher: ${matcher}`)

            const value = _.get(data, name)
            return { ...response, path: `${path}/${value}` }
        }
        return { ...response, path: `${path}${matcher}` }
    },
}
