/**
 * Query string. This will have to be mached by the query string params, and will append corresponding parameters to the Controller.
 *
 * Example: '/?a=string!&b=number' => Controller(...args, a, b?)
 */
export type QueryT =
    | `?${QueryParam}`
    | `?${QueryParam}&${QueryParam}`
    | `?${QueryParam}&${QueryParam}&${QueryParam}`

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

export type returnObject<Q extends QueryT> =
    Q extends `?${infer A extends QueryParam}&${infer B extends QueryParam}&${infer C extends QueryParam}`
        ? paramObject<A> & paramObject<B> & paramObject<C>
        : Q extends `?${infer A extends QueryParam}&${infer B extends QueryParam}`
        ? paramObject<A> & paramObject<B>
        : Q extends `?${infer A extends QueryParam}`
        ? paramObject<A>
        : unknown
