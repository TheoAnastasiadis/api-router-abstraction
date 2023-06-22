import { ConsumedRequest, RequestT } from "../common/request"
import { ValidatorI } from "./validator"

//helpers
type QueryParam = `${string}=${"string" | "number" | "boolean"}${"!" | ""}`

type toType<S extends string> = S extends "string"
    ? string
    : S extends "number"
    ? number
    : S extends "boolean"
    ? boolean
    : unknown

type paramObject<Q extends QueryParam> = Q extends `${infer N}=${infer T}`
    ? T extends `${infer t}!`
        ? Record<N, toType<t>>
        : Partial<Record<N, toType<T>>>
    : never

/**
 * Query string. This will have to be mached by the query string params, and will append corresponding parameters to the Controller.
 *
 * Example: '/?a=string!&b=number' => Controller(...args, a, b?)
 */
export type QueryT =
    | `?${QueryParam}`
    | `?${QueryParam}&${QueryParam}`
    | `?${QueryParam}&${QueryParam}&${QueryParam}`
//that's enough...

export type returnObject<Q extends QueryT> =
    Q extends `?${infer A extends QueryParam}&${infer B extends QueryParam}&${infer C extends QueryParam}`
        ? paramObject<A> & paramObject<B> & paramObject<C>
        : Q extends `?${infer A extends QueryParam}&${infer B extends QueryParam}`
        ? paramObject<A> & paramObject<B>
        : Q extends `?${infer A extends QueryParam}`
        ? paramObject<A>
        : unknown

export const QueryValidator: ValidatorI<QueryT> = {
    is: function (val: string): val is QueryT {
        return !!val.match(/^\?(?:\*=\S*&){0,}(?:.\S*=\S*)$/gm)
    },
    consume: (request: RequestT, validator: QueryT) => {
        //parse path info
        const [_, query] = request.path.split("?")
        const real = Array.from(new URLSearchParams(query).entries())

        //parseValidatorinfo
        const expected = Array.from(new URLSearchParams(validator).entries())

        let consumed = {}
        const unhealty = { ...request, consumed: {}, healthy: false }
        const isMandatory = (value: string) => value.includes("!")

        for (const param of expected) {
            const [name, match] = param
            const found = real.find((realValue) => realValue[0] == name)

            if (!found && isMandatory(match)) return unhealty
            if (!found) continue

            const [realName, realValue] = found
            switch (match.replace("!", "") /*don't need this any more*/) {
                case "number": // ex. "page=number!"
                    const num = Number(realValue)
                    if (isNaN(num)) return unhealty
                    else consumed = { ...consumed, [realName]: num }
                    break

                case "boolean": // ex. "allowAdult=boolean"
                    const bool = realValue == "true"
                    if (realValue != "true" && realValue != "false")
                        return unhealty
                    consumed = { ...consumed, [realName]: bool }
                    break

                default: // ex. "locale=string"
                    const str = realValue
                    consumed = { ...consumed, [realName]: str }
                    break
            }
        }

        return {
            ...request,
            consumed,
            healthy: true,
        } satisfies ConsumedRequest<returnObject<QueryT>>
    },
}
