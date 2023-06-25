import { ParserI } from "./common/parser.types"
import { consumeRoute } from "./parser"
import { RequestT } from "./common/request.consumed"
import { Matcher } from "./matchers"
import { authRegistry } from "./matchers/auth"
import { bodyRegistry } from "./matchers/body"
import { controllerRegistry, notYetImplemented } from "./design/controller"
import createDesign from "./design"
import * as _ from "lodash"
import { TaggedController, TaggedMatcher } from "./common/tagged.types"
import { consumeFormatters } from "./formatter"
import {
    ExcludeFromTuple,
    Flatten,
    PartialBy,
    PickFromTuple,
} from "./common/helper.types"

//helper types
type AppropriateData<L extends string, V extends readonly any[]> = PartialBy<
    Parameters<
        PickFromTuple<
            ExcludeFromTuple<Flatten<V>, TaggedMatcher<any>>,
            TaggedController<any, L | undefined>
        >[number]["value"]
    >[number],
    "body"
> &
    Record<string, any>

type Validators<BR extends bodyRegistry, AR extends authRegistry> = readonly [
    ..._.RecursiveArray<TaggedMatcher<Matcher<BR, AR>> | TaggedController<any>>
]

type Config<
    BR extends bodyRegistry,
    AR extends authRegistry,
    CR extends controllerRegistry
> = { bodyRegistry: BR; authRegistry: AR; controllerRegistry: CR }

class RouterGenerator<
    BR extends bodyRegistry,
    AR extends authRegistry,
    CR extends controllerRegistry,
    V extends Validators<BR, AR>
> {
    private readonly validators: V
    private readonly bodyRegistry: BR
    private readonly authRegistry: AR
    private readonly controllerRegistry: CR
    private controllerImplementations?: {
        [key in keyof CR]: (
            args: Parameters<CR[key]>[number],
            router: RouterGenerator<BR, AR, CR, V>
        ) => any
    }
    private constructor(config: Config<BR, AR, CR>, validators: V) {
        this.bodyRegistry = config.bodyRegistry
        this.authRegistry = config.authRegistry
        this.controllerRegistry = config.controllerRegistry
        this.validators = validators
    }
    public static withConfig<
        BR extends bodyRegistry,
        AR extends authRegistry,
        CR extends controllerRegistry
    >(config: Config<BR, AR, CR>): RouterGenerator<BR, AR, CR, []> {
        return new this(config, [])
    }
    parse(request: RequestT) {
        return consumeRoute(
            request,
            this.validators,
            this.bodyRegistry,
            this.authRegistry
        )
    }
    format<const L extends keyof typeof this.controllerRegistry>(
        target: L & string,
        data: AppropriateData<L & string, typeof this.validators>
    ) {
        return consumeFormatters(
            this.validators,
            data,
            target,
            this.bodyRegistry,
            this.authRegistry
        )
    }
    design() {
        return createDesign.withConfig(
            this.bodyRegistry,
            this.authRegistry,
            this.controllerRegistry
        )
    }
    fromSchema<const C extends Validators<BR, AR>>(
        schema: ParserI<C, Record<any, never>>
    ): RouterGenerator<BR, AR, CR, C> {
        const instance = new RouterGenerator(
            {
                bodyRegistry: this.bodyRegistry,
                authRegistry: this.authRegistry,
                controllerRegistry: this.controllerRegistry,
            },
            schema._consumed
        )
        return instance
    }
    registerImpl(implementations: typeof this.controllerImplementations) {
        this.controllerImplementations = implementations
    }
}

export { notYetImplemented, RouterGenerator }

import * as t from "io-ts"
const generator = RouterGenerator.withConfig({
    bodyRegistry: {},
    authRegistry: {},
    controllerRegistry: {
        getPostById: (args: { id: number; name?: string }) =>
            notYetImplemented(),
        getPostsByType: (args: { type: string }) => notYetImplemented(),
    },
})

const { c, f, a } = generator.design()

const schema = c({
    "/posts": a(
        {
            "/:id(number)": c({
                "?name=string": f("getPostById"),
            }),
        },
        {
            "/:type(string)": f("getPostsByType"),
        }
    ),
})

const Router = generator.fromSchema(schema)

Router.registerImpl({
    getPostById: (args, router) => 3,
    getPostsByType: (args, router) => 4,
})

Router.format("getPostById", { id: 3 })
