import { BodyRegistry } from "../common/bodyRegistry.types"
import { ControllerRegistry } from "../common/controllerRegistry.types"
import { Matcher } from "../matchers"
import { BodyT } from "../matchers/body"
import { MethodT } from "../matchers/method"
import { ParamT } from "../matchers/param"
import { QueryT } from "../matchers/query"
import { BodyTReturnObject } from "./body.return"
import { MethodTReturnObject } from "./method.return"
import { ParamTReturnObject } from "./param.return"
import { QueryTReturnObject } from "./query.return"

export type returnObject<
    BR extends BodyRegistry,
    M extends Matcher<BR>
> = M extends BodyT<BR>
    ? BodyTReturnObject<BR, M>
    : M extends MethodT
    ? MethodTReturnObject
    : M extends ParamT
    ? ParamTReturnObject<M>
    : M extends QueryT
    ? QueryTReturnObject<M>
    : never

export type combine<A extends ReadonlyArray<object>> = A extends [
    infer A extends object,
    infer B extends object
]
    ? A & B
    : A extends [
          infer A extends object,
          infer B extends object,
          ...infer R extends Object[]
      ]
    ? combine<[combine<[A, B]>, ...R]>
    : A[0]
