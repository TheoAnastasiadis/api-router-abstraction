import { RequestT } from "../common/request"
import { authRegistry } from "../matchers/auth"
import { bodyRegistry } from "../matchers/body"
import { ParamT } from "../matchers/param"
import { returnObject } from "../returnObjects"
import { ValidatorI } from "./validator.interface"

export const ParamValidator: ValidatorI<ParamT> = {
    is: function (val: string): val is ParamT {
        return !!val.match(
            /\/(?:(?:(?:[a-zA-z0-9]*)$)|(?::\w*?\((?:(?:number)|(?:string)|(?:boolean))\)$))/gm
        )
    },
    consume: (request: RequestT, validator: ParamT) => {
        //helpers
        function hasType(
            v: ParamT
        ): v is `/:${string}(${"string" | "number" | "boolean"})` {
            return validator.startsWith("/:")
        }

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
}
