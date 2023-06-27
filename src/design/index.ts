import { chain as createChain } from "./chain"
import { alt as createAlt } from "./alt"
import { controller as createController } from "./controller"
import { ControllerRegistry } from "../common/controllerRegistry.types"
import { BodyRegistry } from "../common/bodyRegistry.types"

export default {
    withConfig<
        const BR extends BodyRegistry,
        const CR extends ControllerRegistry<BR>
    >(cr: CR, br: BR) {
        const { chain, c } = createChain.withConfig(cr, br)
        const { alt, a } = createAlt.withConfig(cr, br)
        const { controller, f } = createController.withConfig(cr, br)
        return { chain, c, alt, a, controller, f } as const
    },
} as const
