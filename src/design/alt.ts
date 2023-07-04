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
        function alt<
            K1 extends Matcher<BR>,
            K2 extends Matcher<BR>,
            P1 extends Record<string, any>,
            P2 extends Record<string, any>,
            C1 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ],
            C2 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ],
            K3 extends Matcher<BR>,
            P3 extends Record<string, any>,
            C3 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ]
        >(
            child1: Record<K1, ParserI<C1, P1 & returnObject<BR, K1>>>,
            child2: Record<K2, ParserI<C2, P2 & returnObject<BR, K2>>>,
            child3: Record<K3, ParserI<C3, P3 & returnObject<BR, K3>>>
        ): ParserI<
            [
                [TaggedMatcher<K1>, ...C1],
                [TaggedMatcher<K2>, ...C2],
                [TaggedMatcher<K3>, ...C3]
            ],
            | (keyof returnObject<BR, K1> extends never
                  ? P1
                  : Omit<P1, keyof returnObject<BR, K1>>)
            | (keyof returnObject<BR, K2> extends never
                  ? P2
                  : Omit<P2, keyof returnObject<BR, K2>>)
            | (keyof returnObject<BR, K3> extends never
                  ? P3
                  : Omit<P3, keyof returnObject<BR, K3>>)
        >
        function alt<
            K1 extends Matcher<BR>,
            K2 extends Matcher<BR>,
            P1 extends Record<string, any>,
            P2 extends Record<string, any>,
            C1 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ],
            C2 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ],
            K3 extends Matcher<BR>,
            P3 extends Record<string, any>,
            C3 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ],
            K4 extends Matcher<BR>,
            P4 extends Record<string, any>,
            C4 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ]
        >(
            child1: Record<K1, ParserI<C1, P1 & returnObject<BR, K1>>>,
            child2: Record<K2, ParserI<C2, P2 & returnObject<BR, K2>>>,
            child3: Record<K3, ParserI<C3, P3 & returnObject<BR, K3>>>,
            child4: Record<K4, ParserI<C4, P4 & returnObject<BR, K4>>>
        ): ParserI<
            [
                [TaggedMatcher<K1>, ...C1],
                [TaggedMatcher<K2>, ...C2],
                [TaggedMatcher<K3>, ...C3],
                [TaggedMatcher<K4>, ...C4]
            ],
            | (keyof returnObject<BR, K1> extends never
                  ? P1
                  : Omit<P1, keyof returnObject<BR, K1>>)
            | (keyof returnObject<BR, K2> extends never
                  ? P2
                  : Omit<P2, keyof returnObject<BR, K2>>)
            | (keyof returnObject<BR, K3> extends never
                  ? P3
                  : Omit<P3, keyof returnObject<BR, K3>>)
            | (keyof returnObject<BR, K4> extends never
                  ? P4
                  : Omit<P4, keyof returnObject<BR, K4>>)
        >
        function alt<
            K1 extends Matcher<BR>,
            K2 extends Matcher<BR>,
            P1 extends Record<string, any>,
            P2 extends Record<string, any>,
            C1 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ],
            C2 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ],
            K3 extends Matcher<BR>,
            P3 extends Record<string, any>,
            C3 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ],
            K4 extends Matcher<BR>,
            P4 extends Record<string, any>,
            C4 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ],
            K5 extends Matcher<BR>,
            P5 extends Record<string, any>,
            C5 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ]
        >(
            child1: Record<K1, ParserI<C1, P1 & returnObject<BR, K1>>>,
            child2: Record<K2, ParserI<C2, P2 & returnObject<BR, K2>>>,
            child3: Record<K3, ParserI<C3, P3 & returnObject<BR, K3>>>,
            child4: Record<K4, ParserI<C4, P4 & returnObject<BR, K4>>>,
            child5: Record<K5, ParserI<C5, P5 & returnObject<BR, K5>>>
        ): ParserI<
            [
                [TaggedMatcher<K1>, ...C1],
                [TaggedMatcher<K2>, ...C2],
                [TaggedMatcher<K3>, ...C3],
                [TaggedMatcher<K4>, ...C4],
                [TaggedMatcher<K5>, ...C5]
            ],
            | (keyof returnObject<BR, K1> extends never
                  ? P1
                  : Omit<P1, keyof returnObject<BR, K1>>)
            | (keyof returnObject<BR, K2> extends never
                  ? P2
                  : Omit<P2, keyof returnObject<BR, K2>>)
            | (keyof returnObject<BR, K3> extends never
                  ? P3
                  : Omit<P3, keyof returnObject<BR, K3>>)
            | (keyof returnObject<BR, K4> extends never
                  ? P4
                  : Omit<P4, keyof returnObject<BR, K4>>)
            | (keyof returnObject<BR, K5> extends never
                  ? P5
                  : Omit<P5, keyof returnObject<BR, K5>>)
        >
        function alt<
            K1 extends Matcher<BR>,
            K2 extends Matcher<BR>,
            P1 extends Record<string, any>,
            P2 extends Record<string, any>,
            C1 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ],
            C2 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ],
            K3 extends Matcher<BR>,
            P3 extends Record<string, any>,
            C3 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ],
            K4 extends Matcher<BR>,
            P4 extends Record<string, any>,
            C4 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ],
            K5 extends Matcher<BR>,
            P5 extends Record<string, any>,
            C5 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ],
            K6 extends Matcher<BR>,
            P6 extends Record<string, any>,
            C6 extends readonly [
                TaggedController<any> | TaggedMatcher<Matcher<BR>>,
                ...any[]
            ]
        >(
            child1: Record<K1, ParserI<C1, P1 & returnObject<BR, K1>>>,
            child2: Record<K2, ParserI<C2, P2 & returnObject<BR, K2>>>,
            child3: Record<K3, ParserI<C3, P3 & returnObject<BR, K3>>>,
            child4: Record<K4, ParserI<C4, P4 & returnObject<BR, K4>>>,
            child5: Record<K5, ParserI<C5, P5 & returnObject<BR, K5>>>,
            child6: Record<K6, ParserI<C6, P6 & returnObject<BR, K6>>>
        ): ParserI<
            [
                [TaggedMatcher<K1>, ...C1],
                [TaggedMatcher<K2>, ...C2],
                [TaggedMatcher<K3>, ...C3],
                [TaggedMatcher<K4>, ...C4],
                [TaggedMatcher<K5>, ...C5],
                [TaggedMatcher<K6>, ...C6]
            ],
            | (keyof returnObject<BR, K1> extends never
                  ? P1
                  : Omit<P1, keyof returnObject<BR, K1>>)
            | (keyof returnObject<BR, K2> extends never
                  ? P2
                  : Omit<P2, keyof returnObject<BR, K2>>)
            | (keyof returnObject<BR, K3> extends never
                  ? P3
                  : Omit<P3, keyof returnObject<BR, K3>>)
            | (keyof returnObject<BR, K4> extends never
                  ? P4
                  : Omit<P4, keyof returnObject<BR, K4>>)
            | (keyof returnObject<BR, K5> extends never
                  ? P5
                  : Omit<P5, keyof returnObject<BR, K5>>)
            | (keyof returnObject<BR, K6> extends never
                  ? P6
                  : Omit<P6, keyof returnObject<BR, K6>>)
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
