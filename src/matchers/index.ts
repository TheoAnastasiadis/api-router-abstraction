import { ParamT } from "./param"
import { MethodT } from "./method"
import { QueryT } from "./query"
import { BodyT, bodyRegistry } from "./body"
import { AuthT, authRegistry } from "./auth"

export type Matcher<BR extends bodyRegistry, AR extends authRegistry> =
    | ParamT
    | MethodT
    | QueryT
    | BodyT<BR>
    | AuthT<AR>
