//utility wrappers for easy runtime differentiation

export type TaggedMatcher<T> = {
    _tag: "Matcher"
    value: T
}

export type TaggedController<L extends string> = {
    _tag: "Controller"
    label: L
}
