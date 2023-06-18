/**
 * Authentication contraints. These will be matched by accessing the request headers and cookie information. You can specifiy multiple type of middleware in an authentication registry.
 *
 * For example with an auth registry of
 * ```{
 *  simple: (headers, cookies) => {...}
 * } & {
 *  admin: (headers, cookies) => {...}
 * }```
 *
 * In this example, the auth parameter can take either one of `auth_simple` or `auth_admin`.
 */
export type AuthT<R extends authRegistry> = `auth_${(keyof R) & string}`

export type authRegistry = Record<string, () => Object | undefined>

export type returnObject<
    R extends authRegistry,
    A extends AuthT<R>
> = A extends `auth_${infer N extends string}`
    ? { user: ReturnType<R[N]> }
    : never


