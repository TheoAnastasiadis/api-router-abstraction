import { ParserI } from "./common/parser.types"
import { consumeRoute } from "./parser"
import { RequestT } from "./common/request.consumed"
import { Matcher } from "./matchers"
import { TaggedController, TaggedMatcher } from "./common/tagged.types"
import { consumeFormatters } from "./formatter"
import { ControllerRegistry } from "./common/controllerRegistry.types"
import createDesign from "./design"
import * as t from "io-ts"
import * as _ from "lodash"
import { BodyRegistry } from "./common/bodyRegistry.types"

//helper types
type Validators<
    BR extends BodyRegistry,
    CR extends ControllerRegistry<BR>
> = readonly [
    ..._.RecursiveArray<TaggedMatcher<Matcher<BR>> | TaggedController<any>>
]

type Config<CR extends ControllerRegistry<BR>, BR extends BodyRegistry> = {
    controllerRegistry: CR
    bodyRegistry: BR
}

class RouterGenerator<
    CR extends ControllerRegistry<BR>,
    BR extends BodyRegistry
> {
    private readonly validators: Validators<BR, CR>
    private readonly controllerRegistry: CR
    private readonly bodyRegistry: BR
    private constructor(
        config: Config<CR, BR>,
        validators: Validators<BR, CR>
    ) {
        this.controllerRegistry = config.controllerRegistry
        this.bodyRegistry = config.bodyRegistry
        this.validators = validators
    }
    public static withConfig<
        CR extends ControllerRegistry<BR>,
        BR extends BodyRegistry
    >(config: Config<CR, BR>): RouterGenerator<CR, BR> {
        return new this(config, [])
    }
    parse(request: RequestT) {
        return consumeRoute(request, this.validators, this.bodyRegistry)
    }
    format<const L extends keyof CR & string>(
        target: L,
        data: Readonly<
            t.TypeOf<CR[L]["args"]> &
                (keyof BR extends never
                    ? object
                    : CR[L]["body"] extends keyof BR
                    ? { body: t.TypeOf<BR[CR[L]["body"]]["fields"]> }
                    : object)
        >
    ) {
        return consumeFormatters(
            this.validators,
            data,
            target,
            this.bodyRegistry
        )
    }
    design() {
        return createDesign.withConfig(
            this.controllerRegistry,
            this.bodyRegistry
        )
    }
    fromSchema<const C extends Validators<BR, CR>>(
        schema: ParserI<C, Record<any, never>>
    ): RouterGenerator<CR, BR> {
        const instance = new RouterGenerator(
            {
                controllerRegistry: this.controllerRegistry,
                bodyRegistry: this.bodyRegistry,
            },
            schema._consumed
        )
        return instance
    }
}

export { RouterGenerator }

const generator = RouterGenerator.withConfig({
    controllerRegistry: {
        getPostsByAuthor: {
            args: t.type({
                name: t.string,
                age: t.number,
                trending: t.boolean,
            }),
            body: "post",
        },
    },
    bodyRegistry: {
        post: {
            fields: t.type({
                id: t.number,
                content: t.string,
            }),
        },
    },
})

const { c, f, a } = generator.design()

const schema = c({
    "/:name(string)": c({
        "?age=number": c({
            "?trending=boolean!": c({
                post_body: f("getPostsByAuthor"),
            }),
        }),
    }),
})

const router = generator.fromSchema(schema)

const result = router.parse({ path: "/posts/3?name=John" })

// const impl = Router.getImplementation("getPostById")

router.format("getPostsByAuthor", {
    trending: true,
    name: "2",
    age: 2,
    body: {
        id: 5,
        content: "Loram Ipsum",
    },
})
