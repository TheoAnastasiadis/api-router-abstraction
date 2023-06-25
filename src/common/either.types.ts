type Right<T> = {
    _tag: "Right"
    right: T
}

type Left<T> = {
    _tag: "Left"
    left: T
}

export type Either<L, R> = Left<L> | Right<R>
