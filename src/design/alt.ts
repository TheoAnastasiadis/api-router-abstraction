import { Matcher } from "../matchers"
import { authRegistry } from "../matchers/auth"
import { bodyRegistry } from "../matchers/body"
import { returnObject } from "../returnObjects"
import { ParserI } from "../common/parser"
import * as _ from "lodash"
import { TaggedController, TaggedMatcher } from "../common/wrappers"

export const alt = {
    withConfig<BR extends bodyRegistry, AR extends authRegistry>(
        br: BR,
        ar: AR
    ) {
        function alt<
            const K1 extends Matcher<BR, AR>,
            const K2 extends Matcher<BR, AR>,
            const P1 extends Record<string, any>,
            const P2 extends Record<string, any>,
            const C1 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR, AR>>,
                ...any[]
            ],
            const C2 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR, AR>>,
                ...any[]
            ]
        >(
            child1: Record<K1, ParserI<C1, P1 & returnObject<BR, AR, K1>>>,
            child2: Record<K2, ParserI<C2, P2 & returnObject<BR, AR, K2>>>
        ): ParserI<
            [[TaggedMatcher<K1>, ...C1], [TaggedMatcher<K2>, ...C2]],
            | (keyof returnObject<BR, AR, K1> extends never
                  ? P1
                  : Omit<P1, keyof returnObject<BR, AR, K1>>)
            | (keyof returnObject<BR, AR, K2> extends never
                  ? P2
                  : Omit<P2, keyof returnObject<BR, AR, K2>>)
        >
        function alt(
            ...children: [
                Record<Matcher<BR, AR>, ParserI<any, any>>,
                Record<Matcher<BR, AR>, ParserI<any, any>>,
                ...Record<Matcher<BR, AR>, ParserI<any, any>>[]
            ]
        ): ParserI<
            [
                [TaggedMatcher<Matcher<BR, AR>>, ...any[]],
                [TaggedMatcher<Matcher<BR, AR>>, ...any[]],
                ...[TaggedMatcher<Matcher<BR, AR>>, ...any[]][]
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
                [TaggedMatcher<Matcher<BR, AR>>, ...any[]],
                [TaggedMatcher<Matcher<BR, AR>>, ...any[]],
                ...[TaggedMatcher<Matcher<BR, AR>>, ...any[]][]
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
