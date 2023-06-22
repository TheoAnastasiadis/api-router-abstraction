export type ValidatorWrapper<T> = {
    _tag: "validator"
    value: T
}

export type LabelWrapper<T> = {
    _tag: "label"
    value: T
}

export type ControllerWrapper<T> = {
    _tag: "validator"
    value: T
}

export type Wrapped<T> =
    | ValidatorWrapper<T>
    | LabelWrapper<T>
    | ControllerWrapper<T>
