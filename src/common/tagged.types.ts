//utility wrappers for easy runtime differentiation

import { Either } from "./either.types"

export type TaggedMatcher<T> = {
    _tag: "Matcher"
    value: T
}

export type TaggedController<
    T extends (args: any) => never,
    L extends string | undefined = string | undefined
> = {
    _tag: "Controller"
    label: L
    value: T
}
