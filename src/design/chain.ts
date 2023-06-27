import { ParserI } from "../common/parser.types"
import * as _ from "lodash"
import { Matcher } from "../matchers"
import { combine, returnObject } from "../returnObjects"
import { TaggedController, TaggedMatcher } from "../common/tagged.types"
import { ControllerRegistry } from "../common/controllerRegistry.types"
import { BodyRegistry } from "../common/bodyRegistry.types"

export const chain = {
    withConfig<
        const BR extends BodyRegistry,
        const CR extends ControllerRegistry<BR>
    >(cr: CR, br: BR) {
        function chain<
            const K extends Matcher<BR>,
            const P extends Record<string, any>,
            const C extends readonly [
                ..._.RecursiveArray<
                    TaggedMatcher<Matcher<BR>> | TaggedController<any>
                >
            ]
        >(
            child: Record<K, ParserI<C, combine<[P, returnObject<BR, K>]>>>
        ): ParserI<
            readonly [TaggedMatcher<K>, ...C],
            keyof returnObject<BR, K> extends never
                ? P
                : Omit<P, keyof returnObject<BR, K>>
        > {
            const matcher = Object.keys(child)[0] as keyof typeof child
            const consumed = child[matcher]._consumed

            return {
                _consumed: [{ _tag: "Matcher", value: matcher }, ...consumed],
                _pending: {} as keyof returnObject<BR, K> extends never
                    ? P
                    : Omit<P, keyof returnObject<BR, K>>, //this exists only at compile time
            }
        }

        const c = chain

        return { chain, c } as const
    },
} as const
