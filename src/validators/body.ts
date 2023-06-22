import * as t from "io-ts"
import { ConsumedRequest, RequestT } from "../common/request"
import { ValidatorI } from "./validator"

/**
 * Body contraints. These will be matched to body objects at runtimes using io-ts types. The name of a body parameter should be `{keyof bodyRegistry}_body`
 *
 * For example with a body registry of
 * ```{
 *  post: t.type({
 *      date: t.string,
 *      text: t.string
 *      }),
 * } & {
 *  user: t.type({
 *      name: t.string,
 *      id: t.number
 *      })
 * }```
 *
 * the body parameter can take either one of `post_body` or `user_body`.
 */
export type BodyT<R extends bodyRegistry> = `${keyof R & string}_body`

export type bodyRegistry = Record<string, t.TypeC<any>>

export type returnObject<
    R extends bodyRegistry,
    B extends BodyT<R>
> = B extends `${infer N extends keyof R & string}_body`
    ? { body: t.TypeOf<R[N]> }
    : never

export const BodyValidator: ValidatorI<BodyT<any>> = {
    is<BR extends bodyRegistry>(
        val: string,
        bodyRegistry?: BR
    ): val is BodyT<BR> {
        const { validatorKey } = val.match(/(?<validatorKey>\w*?)_body/)
            ?.groups || { validatorKey: undefined }
        const registryKeys = Object.keys(bodyRegistry || {})

        return (
            !!bodyRegistry &&
            !!validatorKey &&
            registryKeys.includes(validatorKey)
        )
    },
    consume(request: RequestT, validator, bodyRegistry) {
        //request info
        const { body } = request
        //validator info
        const { key } = validator.match(/(?<key>\w*?)_body/)?.groups as {
            key: string
        }

        if (typeof body == "undefined" || !bodyRegistry)
            return {
                ...request,
                consumed: { body: {} },
                healthy: true,
            }

        const decoded = bodyRegistry[key].decode(body)
        if (decoded._tag == "Right")
            return {
                ...request,
                consumed: {
                    body: decoded.right as t.TypeOf<
                        (typeof bodyRegistry)[typeof key]
                    >,
                },
                healthy: true,
            }

        return {
            ...request,
            consumed: { body: {} },
            healthy: false,
        }
    },
}
