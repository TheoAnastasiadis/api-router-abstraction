import * as t from "io-ts"
import { BodyRegistry } from "./bodyRegistry.types"

type ControllerAbstraction<
    A extends t.Props = any,
    BR extends BodyRegistry = {},
    R extends t.Props = any
> = {
    args: t.TypeC<A>
    body?: keyof BR
    returnType?: R
}

export type ControllerRegistry<
    BR extends BodyRegistry,
    K extends string = string
> = Record<K, ControllerAbstraction<any, BR, any>>
