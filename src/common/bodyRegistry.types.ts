import * as t from "io-ts"

type BodyAbstraction<F extends t.Props = any> = {
    fields: t.TypeC<F>
}

export type BodyRegistry<K extends string = string> = Record<K, BodyAbstraction>
