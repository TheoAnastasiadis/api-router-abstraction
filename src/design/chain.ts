import { ParserI } from "../common/parser.types"
import * as _ from "lodash"
import { Matcher } from "../matchers"
import { authRegistry } from "../matchers/auth"
import { bodyRegistry } from "../matchers/body"
import { combine, returnObject } from "../returnObjects"
import { TaggedController, TaggedMatcher } from "../common/tagged.types"

export const chain = {
    withConfig<BR extends bodyRegistry, AR extends authRegistry>(
        br: BR,
        ar: AR
    ) {
        function chain<
            const K extends Matcher<BR, AR>,
            const P extends Record<string, any>,
            const C extends _.RecursiveArray<
                TaggedMatcher<Matcher<BR, AR>> | TaggedController<any>
            >
        >(
            child: Record<K, ParserI<C, combine<[P, returnObject<BR, AR, K>]>>>
        ): ParserI<
            readonly [TaggedMatcher<K>, ...C],
            keyof returnObject<BR, AR, K> extends never
                ? P
                : Omit<P, keyof returnObject<BR, AR, K>>
        > {
            const matcher = Object.keys(child)[0] as keyof typeof child
            const consumed = child[matcher]._consumed

            return {
                _consumed: [{ _tag: "Matcher", value: matcher }, ...consumed],
                _pending: {} as keyof returnObject<BR, AR, K> extends never
                    ? P
                    : Omit<P, keyof returnObject<BR, AR, K>>, //this exists only at compile time
            }
        }

        const c = chain

        return { chain, c } as const
    },
} as const
