import { ValidatorI } from "./validator"

/**
 * Method types. This will have to be mached to HTTP method names.
 *
 * Examples: GET, POST, etc.
 *
 */
export type MethodT =
    | "GET"
    | "POST"
    | "DELETE"
    | "PUT"
    | "GET,POST"
    | "GET,DELETE"
    | "GET,POST"
    | "GET,PUT"
    | "GET,DELETE"
    | "POST,PUT"
    | "POST,DELETE"
    | "PUT,DELETE"
    | "GET,POST,PUT"
    | "GET,POST,DELETE"
    | "GET PUT,DELETE"
    | "POST,PUT,DELETE"
    | "GET,POST,PUT,DELETE"

export type returnObject = {}

export const MethodValidator: ValidatorI<MethodT> = {
    is(val: string): val is MethodT {
        return val
            .split(",")
            .map((method) => ["GET", "POST", "PUT", "DELETE"].includes(method))
            .reduce((p, c) => p && c)
    },
    consume(request, validator) {
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
