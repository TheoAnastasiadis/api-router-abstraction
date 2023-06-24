//helper types
export type Flatten<T extends readonly [..._.RecursiveArray<any>]> =
    T extends readonly [...infer C]
        ? C extends [infer First, ...infer Rest]
            ? First extends unknown[]
                ? [...Flatten<First>, ...Flatten<Rest>]
                : [First, ...Flatten<Rest>]
            : []
        : []

export type ExcludeFromTuple<T extends readonly any[], E> = T extends [
    infer F,
    ...infer R
]
    ? [F] extends [E]
        ? ExcludeFromTuple<R, E>
        : [F, ...ExcludeFromTuple<R, E>]
    : []

export type PickFromTuple<T extends readonly any[], E> = T extends [
    infer F,
    ...infer R
]
    ? [F] extends [E]
        ? [F, ...PickFromTuple<R, E>]
        : PickFromTuple<R, E>
    : []

export type PartialBy<T, K extends string> = Omit<T, K> &
    Partial<Pick<T, K & keyof T>>
