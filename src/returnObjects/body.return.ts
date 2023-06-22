import { bodyRegistry, BodyT } from "../matchers/body"
import * as t from "io-ts"

export type BodyTReturnObject<
    R extends bodyRegistry,
    B extends BodyT<R>
> = B extends `${infer N extends keyof R & string}_body`
    ? { body: t.TypeOf<R[N]> }
    : never
