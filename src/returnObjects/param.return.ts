import { ParamT } from "../matchers/param"

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

export type ParamTReturnObject<P extends ParamT> =
    P extends `/:${string}(${string})`
        ? Readonly<Record<paramName<P>, paramType<P>>>
        : Readonly<{}>
