//utility types for easy runtime differentiation

export type TaggedMatcher<T> = {
    _tag: "Matcher"
    value: T
}

export type TaggedController<
    T,
    L extends string | undefined = string | undefined
> = {
    _tag: "Controller"
    label: L
    value: T
}
