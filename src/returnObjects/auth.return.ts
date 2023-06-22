import { AuthT, authRegistry } from "../matchers/auth"

export type AuthTReturnObject<
    R extends authRegistry,
    A extends AuthT<R>
> = A extends `auth_${infer N extends string}`
    ? { user: ReturnType<R[N]> }
    : never
