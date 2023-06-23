import { RequestT } from "../common/request"
import { QueryT } from "../matchers/query"
import isQueryT from "../narrowers/isQueryT"
import { ValidatorI } from "./validator.interface"
import * as _ from "lodash"

export const QueryValidator: ValidatorI<QueryT> = {
    is: isQueryT,
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
        }
    },
    format(data, matcher, response) {
        let { path } = response
        const names = Array.from(new URLSearchParams(matcher).entries()).map(
            ([name, value]) => name
        )
        const values = names.map((name) => data[name])
        const queryString = new URLSearchParams(
            Object.fromEntries(_.zip(names, values))
        ).toString()
        path = `${path}?${queryString}`

        return { ...response, path }
    },
}
