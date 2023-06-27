import { ParsingErrors, RequestT } from "../common/request.consumed"
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
        const element = path.split(/\/|\?/)[1] // "/post/2" => ["", "post", "2"]
        const rest = path.substring(element.length + 1) //for the missing "/"
        //parse validator info
        if (hasType(validator)) {
            // "/:id(number)"
            const { name, type } = validator.match(
                /\/(?::(?<name>\w+?)\((?<type>(?:string)|(?:number)|(?:boolean))\))/
            )?.groups || { name: "", type: "" }
            //initializations
            let consumed: returnObject<any, typeof validator> = {}
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

            switch (healthy) {
                case true:
                    return {
                        ...request,
                        path: rest,
                        consumed,
                        healthy,
                    }
                    break

                default:
                    return {
                        ...request,
                        path: rest,
                        consumed,
                        healthy,
                        error: ParsingErrors.PATH_ERROR,
                    }
                    break
            }
        } else {
            // ex. "/posts"
            const name = validator.substring(1)
            const healthy = element === name
            switch (healthy) {
                case true:
                    return { ...request, path: rest, consumed: {}, healthy }
                    break

                default:
                    return {
                        ...request,
                        path: rest,
                        consumed: {},
                        healthy,
                        error: ParsingErrors.PATH_ERROR,
                    }
                    break
            }
        }
    },
    format(data, matcher, response) {
        let { path } = response

        if (hasType(matcher)) {
            const { name } = matcher.match(/\/:(?<name>\w+?)\(/)?.groups || {
                name: undefined,
            }

            if (!name) throw new TypeError(`Invalid ParamT matcher: ${matcher}`)

            const value = _.get(data, name)
            return { ...response, path: `${path}/${value}` }
        }
        return { ...response, path: `${path}${matcher}` }
    },
}
