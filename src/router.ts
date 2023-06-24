import { ParserI } from "./common/parser"
import { consumeRoute } from "./parser"
import { RequestT } from "./common/request"
import { Matcher } from "./matchers"
import { authRegistry } from "./matchers/auth"
import { bodyRegistry } from "./matchers/body"
import createDesign from "./design"
import * as _ from "lodash"
import { TaggedController, TaggedMatcher } from "./common/wrappers"
import { consumeFormatters } from "./formatter"
import { ExcludeFromTuple, Flatten, PickFromTuple } from "./common/helperTypes"

export class RouterGenerator<
    BR extends bodyRegistry,
    AR extends authRegistry,
    V extends readonly [
        ..._.RecursiveArray<
            TaggedMatcher<Matcher<BR, AR>> | TaggedController<any>
        >
    ]
> {
    private readonly validators: V
    private readonly bodyRegistry: BR
    private readonly authRegistry: AR
    private constructor(
        config: { bodyRegistry: BR; authRegistry: AR },
        validators: V
    ) {
        this.bodyRegistry = config.bodyRegistry
        this.authRegistry = config.authRegistry
        this.validators = validators
    }
    public static withConfig<
        BR extends bodyRegistry,
        AR extends authRegistry
    >(config: {
        bodyRegistry: BR
        authRegistry: AR
    }): RouterGenerator<BR, AR, []> {
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
    format<
        const L extends ExcludeFromTuple<
            Flatten<typeof this.validators>,
            TaggedMatcher<any>
        >[number]["label"] &
            string
    >(
        target: L,
        data: Parameters<
            PickFromTuple<
                ExcludeFromTuple<
                    Flatten<typeof this.validators>,
                    TaggedMatcher<any>
                >,
                TaggedController<any, L | undefined>
            >[number]["value"]
        >[number] &
            Record<string, any>
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
        return createDesign.withConfig(this.bodyRegistry, this.authRegistry)
    }
    fromSchema<
        const C extends readonly [
            ..._.RecursiveArray<
                TaggedMatcher<Matcher<BR, AR>> | TaggedController<any>
            >
        ]
    >(schema: ParserI<C, Record<any, never>>): RouterGenerator<BR, AR, C> {
        const instance = new RouterGenerator(
            {
                bodyRegistry: this.bodyRegistry,
                authRegistry: this.authRegistry,
            },
            schema._consumed
        )
        return instance as RouterGenerator<BR, AR, C>
    }
}

import * as t from "io-ts"
const generator = RouterGenerator.withConfig({
    bodyRegistry: {},
    authRegistry: {},
})

const { c, f, a } = generator.design()

const schema = c({
    "/posts": a(
        {
            "/:id(number)": f((args: { id: number }) => 3, "a"),
        },
        {
            "/:type(string)": f((args: { type: string }) => 4, "b"),
        }
    ),
})

const router = generator.fromSchema(schema)

router.format("b", { type: "34" })
