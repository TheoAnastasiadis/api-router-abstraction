import { Validator } from "../validators"
import { authRegistry } from "../validators/auth"
import { bodyRegistry } from "../validators/body"
import { returnObject } from "../validators/returnObject"
import { ParserI, createParser } from "./parser"

export const alt = {
    withConfig<BR extends bodyRegistry, AR extends authRegistry>(
        br: BR,
        ar: AR
    ) {
        function alt<
            const K1 extends Validator<BR, AR>,
            const K2 extends Validator<BR, AR>,
            const P1 extends Record<string, any>,
            const P2 extends Record<string, any>,
            const C1 extends Readonly<any[]>,
            const C2 extends Readonly<any[]>,
            const L1 extends Readonly<any[]>,
            const L2 extends Readonly<any[]>
        >(
            child1: Record<K1, ParserI<C1, P1 & returnObject<BR, AR, K1>, L1>>,
            child2: Record<K2, ParserI<C2, P2 & returnObject<BR, AR, K2>, L2>>
        ): ParserI<
            [[K1, ...C1], [K2, ...C2]],
            | Omit<P1, keyof returnObject<BR, AR, K1>>
            | Omit<P2, keyof returnObject<BR, AR, K2>>,
            readonly [L1, L2]
        >
        function alt(
            ...children: [
                Record<Validator<BR, AR>, ParserI<any, any, any>>,
                Record<Validator<BR, AR>, ParserI<any, any, any>>,
                ...Record<Validator<BR, AR>, ParserI<any, any, any>>[]
            ]
        ): ParserI<any[][], any, readonly any[]> {
            const keys = children.map((child) => Object.keys(child)[0])
            const parsers = children.map((child) => Object.values(child)[0])
            const alreadyConsumed = parsers.map((parser) => parser._consumed)
            const labels = parsers.map((parser) => parser._labels)

            const newConsumed = keys.map((key, i) => [
                key,
                ...alreadyConsumed[i],
            ])

            return createParser(newConsumed, {}, labels)
        }

        const a = alt

        return { alt, a } as const
    },
} as const
