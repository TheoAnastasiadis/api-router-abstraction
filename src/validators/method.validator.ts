import { RequestT } from "../common/request"
import { MethodT } from "../matchers/method"
import isMethodT from "../narrowers/isMethodT"
import { ValidatorI } from "./validator.interface"

export const MethodValidator: ValidatorI<MethodT> = {
    is: isMethodT,
    consume(request: RequestT, validator: MethodT) {
        //parse request info
        const { path, method, headers, cookies } = request
        //parse validator info
        const methods = validator.split(",")

        if ((method && methods.includes(method)) || !method)
            //method will have to match only if provided
            return {
                path,
                method,
                headers,
                cookies,
                consumed: {},
                healthy: true,
            }

        return {
            path,
            method,
            headers,
            cookies,
            consumed: {},
            healthy: false,
        }
    },
    format(data, matcher, response) {
        const firstMethod = matcher.split(",")[0] //prefer the first matching method

        return { ...response, method: firstMethod }
    },
}
