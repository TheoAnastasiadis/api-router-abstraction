import { RequestT } from "../parser/request"
import { ValidatorI } from "./validator"

//helpers
type paramName<P extends string> = P extends `/:${infer T}(${string})`
    ? T
    : P extends `/${infer T}`
    ? T
    : never

type paramType<P extends string> = P extends `/:${string}(${infer T})`
    ? T extends "number"
        ? number
        : T extends "string"
        ? string
        : boolean
    : undefined

/**
 * Param validators. This will have to be mached to param literals in the path, and will append corresponding parameters to the controller.
 *
 * For example:
 * '/posts' => Controller(...args)
 * '/:id' => Controller(id, ...args)
 */
export type ParamT =
    | `/:${string}(number)`
    | `/:${string}(string)`
    | `/:${string}(boolean)`
    | `/${string}`

export type returnObject<P extends ParamT> = P extends `/:${string}(${string})`
    ? Readonly<Record<paramName<P>, paramType<P>>>
    : Readonly<{}>

export const ParamValidator: ValidatorI<ParamT> = {
    is: function (val: string): val is ParamT {
        return !!val.match(
            /\/(?:(?:(?:[a-zA-z0-9]*)$)|(?::\w*?\((?:(?:number)|(?:string)|(?:boolean))\)$))/gm
        )
    },
    consume: (request: RequestT, validator: ParamT) => {
        //parse path info
        const { path } = request
        const { element, rest } = path.match(
            /\/(?<element>\w*)(?:(?<rest>[/?].*))?/
        )?.groups || { element: "", rest: "" }
        //parse validator info
        if (validator.startsWith("/:")) {
            // "/:id(number)"
            const { name, type } = validator.match(
                /\/(?::(?<name>\w*?)\((?<type>\w*?)\))/
            )?.groups || { name: "", type: "" }
            //initializations
            let consumed = {}
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
