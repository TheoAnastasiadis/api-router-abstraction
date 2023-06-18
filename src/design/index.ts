import { authRegistry } from "../validators/auth"
import { bodyRegistry } from "../validators/body"
import { chain as createChain } from "./chain"
import { alt as createAlt } from "./alt"
import { controller, f } from "./controller"

export default {
    withConfig<BR extends bodyRegistry, AR extends authRegistry>(
        br: BR,
        ar: AR
    ) {
        const { chain, c } = createChain.withConfig(br, ar)
        const { alt, a } = createAlt.withConfig(br, ar)

        return { chain, c, alt, a, controller, f } as const
    },
} as const
