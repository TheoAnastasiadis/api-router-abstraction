import { RequestT } from "../common/request"
/**
 * Param validators. This will have to be mached to param literals in the path, and will append corresponding parameters to the controller.
 *
 * For example:
 * '/posts' => Controller(...args)
 * '/:id' => Controller(id, ...args)
 */
export type ParamT =
    | `/:${string}(number)`
    | `/:${string}(string)`
    | `/:${string}(boolean)`
    | `/${string}`
