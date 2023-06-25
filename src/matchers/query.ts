import { ConsumedRequest, RequestT } from "../common/request.consumed"

//helpers
type QueryParam = `${string}=${"string" | "number" | "boolean"}${"!" | ""}`

/**
 * Query string. This will have to be mached by the query string params, and will append corresponding parameters to the Controller.
 *
 * Example: '/?a=string!&b=number' => Controller(...args, a, b?)
 */
export type QueryT =
    | `?${QueryParam}`
    | `?${QueryParam}&${QueryParam}`
    | `?${QueryParam}&${QueryParam}&${QueryParam}`
//that's enough...
