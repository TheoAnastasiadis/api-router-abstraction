// import { authRegistry } from "./validators/auth"
// import { bodyRegistry } from "./validators/body"
// import createDesign from "./design"
// import { ParserI } from "./design/parser"

// const RouterGenerator = {
//     withConfig<BR extends bodyRegistry, AR extends authRegistry>(config: {
//         br: BR
//         ar: AR
//     }) {
//         const { br, ar } = config
//         const design = createDesign.withConfig(br, ar)

//         const fromSchema = <
//             const C,
//             EMPTY extends Record<string, never>,
//             const L extends readonly any[]
//         >(
//             schema: ParserI<C, EMPTY, L>
//         ) => schema

//         return { design, fromSchema }
//     },
// }

// import * as t from "io-ts"
// const br: bodyRegistry = {
//     post: t.type({
//         author: t.string,
//         length: t.number,
//     }),
// }
// const ar = {} as authRegistry

// const generator = RouterGenerator.withConfig<typeof br, typeof ar>({ br, ar })

// const { a, c, f } = generator.design

// const router = generator.fromSchema(
//     c({
//         news_body: f((args: { body: {} }) => 3),
//     })
// )
