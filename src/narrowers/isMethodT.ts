import { MethodT } from "../matchers/method"

export default function isMethodT(val: string): val is MethodT {
    return val
        .split(",")
        .map((method) => ["GET", "POST", "PUT", "DELETE"].includes(method))
        .reduce((p, c) => p && c)
}
