import * as t from "io-ts"
import { ControllerRegistry } from "../common/controllerRegistry.types"
import { BodyT } from "../matchers/body"
import { BodyRegistry } from "../common/bodyRegistry.types"

export type BodyTReturnObject<
    R extends BodyRegistry,
    B extends BodyT<R>
> = B extends `${infer N extends keyof R & string}_body`
    ? t.TypeOf<R[N]["fields"]>
    : never
