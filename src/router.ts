import { ParserI } from "./common/parser"
import { consumeRoute } from "./parser/consume"
import { RequestT } from "./common/request"
import { Matcher } from "./matchers"
import { authRegistry } from "./matchers/auth"
import { bodyRegistry } from "./matchers/body"
import createDesign from "./design"
import * as _ from "lodash"
import { TaggedController, TaggedMatcher } from "./common/wrappers"

export class RouterGenerator<BR extends bodyRegistry, AR extends authRegistry> {
    private matchers: _.RecursiveArray<
        TaggedMatcher<Matcher<BR, AR>> | TaggedController<any>
    > = []
    private bodyRegistry: BR
    private authRegistry: AR
    public constructor(config: { bodyRegistry: BR; authRegistry: AR }) {
        this.bodyRegistry = config.bodyRegistry
        this.authRegistry = config.authRegistry
    }
    parse(request: RequestT) {
        return consumeRoute(
            request,
            this.matchers,
            this.bodyRegistry,
            this.authRegistry
        )
    }
    design() {
        return createDesign.withConfig(this.bodyRegistry, this.authRegistry)
    }
    fromSchema(schema: ParserI<any, Record<any, never>>) {
        this.matchers = schema._consumed

        const instance = new RouterGenerator({
            bodyRegistry: this.bodyRegistry,
            authRegistry: this.authRegistry,
        })
        instance.matchers = schema._consumed
        return instance
    }
}

// import * as t from "io-ts"
// const generator = new RouterGenerator({
//     bodyRegistry: {},
//     authRegistry: {},
// })

// const { c, f, a } = generator.design()

// const schema = c({
//     "/posts": a(
//         {
//             "/:id(number)": f((args: { id: number }) => 3),
//         },
//         {
//             "/:name(string)": f((args: { name: string }) => 3),
//         }
//     ),
// })

// const router = generator.fromSchema(schema)
