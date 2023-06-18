import { authRegistry } from "./validators/auth"
import { bodyRegistry } from "./validators/body"
import createDesign from "./design"
import { ParserI } from "./design/parser"

const RouterGenerator = {
    withConfig<BR extends bodyRegistry, AR extends authRegistry>(config: {
        br: BR
        ar: AR
    }) {
        const { br, ar } = config
        const design = createDesign.withConfig(br, ar)

        const fromSchema = <
            const C,
            EMPTY extends Record<string, never>,
            const L extends readonly any[]
        >(
            schema: ParserI<C, EMPTY, L>
        ) => schema

        return { design, fromSchema }
    },
}

const br = {} as bodyRegistry
const ar = {} as authRegistry

const generator = RouterGenerator.withConfig({ br, ar })

const { a, c, f } = generator.design

const router = generator.fromSchema(
    c({
        "/posts": c({
            "/:id(number)": f((args: { id: number }) => 4).l("byId"),
        }),
    })
)
