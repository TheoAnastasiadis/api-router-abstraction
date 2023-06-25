//utility wrappers for easy runtime differentiation

import { Either } from "./either.types"

export type TaggedMatcher<T> = {
    _tag: "Matcher"
    value: T
}

export type TaggedController<
    L extends string | undefined = string | undefined
> = {
    _tag: "Controller"
    label: L
}
