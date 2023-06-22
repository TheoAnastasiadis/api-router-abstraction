import { RequestT } from "../common/request"
import { MethodT } from "../matchers/method"
import { ValidatorI } from "./validator.interface"

export const MethodValidator: ValidatorI<MethodT> = {
    is(val: string): val is MethodT {
        return val
            .split(",")
            .map((method) => ["GET", "POST", "PUT", "DELETE"].includes(method))
            .reduce((p, c) => p && c)
    },
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
}
