import { Matcher } from "../matchers"
import { returnObject } from "../returnObjects"
import { ParserI } from "../common/parser.types"
import * as _ from "lodash"
import { TaggedController, TaggedMatcher } from "../common/tagged.types"
import { ControllerRegistry } from "../common/controllerRegistry.types"
import { BodyRegistry } from "../common/bodyRegistry.types"

export const alt = {
    withConfig<
        const BR extends BodyRegistry,
        const CR extends ControllerRegistry<BR>
    >(cr: CR, br: BR) {
        function alt<
            const K1 extends Matcher<BR>,
            const K2 extends Matcher<BR>,
            const P1 extends Record<string, any>,
            const P2 extends Record<string, any>,
            const C1 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ],
            const C2 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ]
        >(
            child1: Record<K1, ParserI<C1, P1 & returnObject<BR, K1>>>,
            child2: Record<K2, ParserI<C2, P2 & returnObject<BR, K2>>>
        ): ParserI<
            [[TaggedMatcher<K1>, ...C1], [TaggedMatcher<K2>, ...C2]],
            | (keyof returnObject<BR, K1> extends never
                  ? P1
                  : Omit<P1, keyof returnObject<BR, K1>>)
            | (keyof returnObject<BR, K2> extends never
                  ? P2
                  : Omit<P2, keyof returnObject<BR, K2>>)
        >
        function alt(
            ...children: [
                Record<Matcher<BR>, ParserI<any, any>>,
                Record<Matcher<BR>, ParserI<any, any>>,
                ...Record<Matcher<BR>, ParserI<any, any>>[]
            ]
        ): ParserI<
            [
                [TaggedMatcher<Matcher<BR>>, ...any[]],
                [TaggedMatcher<Matcher<BR>>, ...any[]],
                ...[TaggedMatcher<Matcher<BR>>, ...any[]][]
            ],
            any
        > {
            const keys = children.map((child) => Object.keys(child)[0])
            const parsers = children.map((child) => Object.values(child)[0])
            const alreadyConsumed = parsers.map((parser) => parser._consumed)
            const newConsumed = keys.map((key, i) => [
                { _tag: "Matcher", value: key },
                ...alreadyConsumed[i],
            ]) as [
                [TaggedMatcher<Matcher<BR>>, ...any[]],
                [TaggedMatcher<Matcher<BR>>, ...any[]],
                ...[TaggedMatcher<Matcher<BR>>, ...any[]][]
            ]
            return {
                _consumed: newConsumed,
                _pending: {},
            }
        }

        const a = alt

        return { alt, a } as const
    },
} as const
