import { RequestT } from "../parser/request"
import { ValidatorI } from "./validator"

/**
 * Param types. This will have to be mached to param literals in the path, and will append corresponding parameters to the Controller.
 *
 * Examples:
 * '/posts' => Controller(...args)
 * '/:id' => Controller(id, ...args)
 *
 */
export type ParamT =
    | `/:${string}(number)`
    | `/:${string}(string)`
    | `/:${string}(boolean)`
    | `/${string}`

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

export type returnObject<P extends ParamT> = P extends `/:${string}(${string})`
    ? Readonly<Record<paramName<P>, paramType<P>>>
    : Readonly<{}>

// "/posts" -> "/true", "/:id(numer)" -> "/posts"
export const ParamValidator: ValidatorI<ParamT> = {
    is: function (val: string): val is ParamT {
        return !!val.match(
            /\/(?:(?:(?:[a-zA-z0-9]*)$)|(?::\w*?\((?:(?:number)|(?:string)|(?:boolean))\)$))/gm
        )
    },
    consume: (request: RequestT, validator: ParamT) => {
        //parse path info
        const { path } = request // "/posts/3/"
        const { element, rest } = path.match(
            /\/(?<element>\w*)(?:(?<rest>[/?].*))?/
        )?.groups || { element: "" }
        //parse validator info
        if (validator.startsWith("/:")) {
            // "/:id(number)"
            const { name, type } = validator.match(
                /\/(?::(?<name>\w*?)\((?<type>\w*?)\))/
            )?.groups || { name: "" }
            //initializations
            let consumed = {}
            let healthy = true
            switch (type) {
                case "number":
                    const num = Number(element)
                    if (isNaN(num)) healthy = false
                    else consumed = { [name]: num } //{id: 3}
                    break

                case "boolean":
                    const bool = element == "true"
                    healthy = element == "true" || element == "false"
                    consumed = { [name]: bool }
                    break

                default: //string
                    const str = element
                    consumed = { [name]: str }
                    break
            }

            return { ...request, path: rest, consumed, healthy }
        } else {
            // "/string"
            const { name } = validator.match(/\/(?<name>\w*)/)?.groups || {
                name: "",
            }
            console.warn([name, element])
            if (element != name)
                return { ...request, path: rest, consumed: {}, healthy: false }
            else return { ...request, path: rest, consumed: {}, healthy: true }
        }
    },
}
