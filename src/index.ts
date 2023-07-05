import { TaggedController, TaggedMatcher } from "./common/tagged.types"
import { ControllerRegistry } from "./common/controllerRegistry.types"
import { BodyRegistry } from "./common/bodyRegistry.types"
import { RequestT } from "./common/request.consumed"
import { ParserI } from "./common/parser.types"
import { consumeFormatters } from "./formatter"
import { consumeRoute } from "./parser"
import { Matcher } from "./matchers"
import createDesign from "./design"
import * as t from "io-ts"
import * as _ from "lodash"
import { Router } from "express"

//helper types
type Validators<BR extends BodyRegistry> = readonly [
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
    private readonly validators: Validators<BR>
    private readonly controllerRegistry: CR
    private readonly bodyRegistry: BR
    private constructor(config: Config<CR, BR>, validators: Validators<BR>) {
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
    fromSchema<const C extends Validators<BR>>(
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

export type ControllerImplementations<R extends RouterGenerator<any, any>> =
    R extends RouterGenerator<infer CR, infer BR>
        ? {
              [K in keyof CR]: (
                  args: t.TypeOf<CR[K]["args"]> &
                      (keyof BR extends never
                          ? object
                          : CR[K]["body"] extends keyof BR
                          ? { body: t.TypeOf<BR[CR[K]["body"]]["fields"]> }
                          : object),
                  router?: R,
                  ...rest: any
              ) => t.TypeOf<CR[K]["returnType"] & object>
          }
        : unknown

export default RouterGenerator
