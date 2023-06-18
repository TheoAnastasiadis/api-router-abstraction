import { ParamT, returnObject as ParamReturnObject } from "./param"
import { MethodT, returnObject as MethodReturnObject } from "./method"
import { QueryT, returnObject as QueryReturnObject } from "./query"
import { BodyT, bodyRegistry, returnObject as BodyReturnObject } from "./body"
import { AuthT, authRegistry, returnObject as AuthReturnObject } from "./auth"

export type returnObject<
    BR extends bodyRegistry,
    AR extends authRegistry,
    V extends ParamT | MethodT | QueryT | BodyT<BR> | AuthT<AR>
> = V extends ParamT
    ? ParamReturnObject<V>
    : V extends MethodT
    ? MethodReturnObject
    : V extends QueryT
    ? QueryReturnObject<V>
    : V extends BodyT<BR>
    ? BodyReturnObject<BR, V>
    : V extends AuthT<AR>
    ? AuthReturnObject<AR, V>
    : never

export type combineReturnObjects<A extends ReadonlyArray<object>> = A extends [
    infer A extends object,
    infer B extends object
]
    ? A & B
    : A extends [
          infer A extends object,
          infer B extends object,
          ...infer R extends Object[]
      ]
    ? combineReturnObjects<[combineReturnObjects<[A, B]>, ...R]>
    : A[0]
