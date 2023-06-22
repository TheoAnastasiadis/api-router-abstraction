import * as t from "io-ts"
import { ConsumedRequest, RequestT } from "../common/request"

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
