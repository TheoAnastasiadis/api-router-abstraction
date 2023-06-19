import * as t from "io-ts"
import { ValidatorI } from "./validator"
import { RequestT } from "../parser/request"

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
export type BodyT<R extends bodyRegistry> = keyof R extends never
    ? ""
    : `${keyof R & string}_body`

export type bodyRegistry = Record<string, t.TypeC<any>>

export type returnObject<
    R extends bodyRegistry,
    B extends BodyT<R>
> = B extends `${infer N extends string}_body`
    ? { body: t.TypeOf<R[N]> }
    : Readonly<{}>

export const BodyValidator: ValidatorI<BodyT<bodyRegistry>> = {
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
    consume<BR extends bodyRegistry>(
        request: RequestT,
        validator: BodyT<bodyRegistry>,
        bodyRegistry?: BR
    ) {
        //request info
        const { body } = request
        //validator info
        const { key } = validator.match(/(?<key>\w*?)_body/)?.groups as {
            key: string
        }

        if (typeof body == "undefined" || !bodyRegistry)
            return { ...request, consumed: { body: {} }, healthy: true }

        const decoded = bodyRegistry[key].decode(body)
        if (decoded._tag == "Right")
            return { ...request, consumed: { body }, healthy: true }

        return { ...request, consumed: { body: {} }, healthy: false }
    },
}
