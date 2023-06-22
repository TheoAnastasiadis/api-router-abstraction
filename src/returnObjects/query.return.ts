import { QueryT } from "../matchers/query"

//helpers
type toType<S extends string> = S extends "string"
    ? string
    : S extends "number"
    ? number
    : S extends "boolean"
    ? boolean
    : unknown

//helpers
type QueryParam = `${string}=${"string" | "number" | "boolean"}${"!" | ""}`

type paramObject<Q extends QueryParam> = Q extends `${infer N}=${infer T}`
    ? T extends `${infer t}!`
        ? Record<N, toType<t>>
        : Partial<Record<N, toType<T>>>
    : never

export type QueryTReturnObject<Q extends QueryT> =
    Q extends `?${infer A extends QueryParam}&${infer B extends QueryParam}&${infer C extends QueryParam}`
        ? paramObject<A> & paramObject<B> & paramObject<C>
        : Q extends `?${infer A extends QueryParam}&${infer B extends QueryParam}`
        ? paramObject<A> & paramObject<B>
        : Q extends `?${infer A extends QueryParam}`
        ? paramObject<A>
        : unknown
