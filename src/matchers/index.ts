import { ParamT } from "./param"
import { MethodT } from "./method"
import { QueryT } from "./query"
import { BodyT } from "./body"
import { ControllerRegistry } from "../common/controllerRegistry.types"
import { BodyRegistry } from "../common/bodyRegistry.types"

export type Matcher<BR extends BodyRegistry> =
    | ParamT
    | MethodT
    | QueryT
    | BodyT<BR>
