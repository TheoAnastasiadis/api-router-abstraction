import { authRegistry } from "../matchers/auth"
import { bodyRegistry } from "../matchers/body"
import { chain as createChain } from "./chain"
import { alt as createAlt } from "./alt"
import {
    controllerRegistry,
    controller as createController,
} from "./controller"

export default {
    withConfig<
        BR extends bodyRegistry,
        AR extends authRegistry,
        CR extends controllerRegistry
    >(br: BR, ar: AR, cr: CR) {
        const { chain, c } = createChain.withConfig(br, ar)
        const { alt, a } = createAlt.withConfig(br, ar)
        const { controller, f } = createController.withConfig(cr)
        return { chain, c, alt, a, controller, f } as const
    },
} as const
