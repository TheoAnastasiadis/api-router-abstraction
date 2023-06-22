import { Validator } from "../validators"
import { authRegistry } from "../validators/auth"
import { bodyRegistry } from "../validators/body"
import { returnObject } from "../validators/returnObject"
import { ParserI, createParser } from "../common/parser"
import { Wrapped, ValidatorWrapper } from "../common/wrappers"
import * as _ from "lodash"

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
            const C1 extends _.RecursiveArray<Wrapped<any>>,
            const C2 extends _.RecursiveArray<Wrapped<any>>
        >(
            child1: Record<K1, ParserI<C1, P1 & returnObject<BR, AR, K1>>>,
            child2: Record<K2, ParserI<C2, P2 & returnObject<BR, AR, K2>>>
        ): ParserI<
            [[ValidatorWrapper<K1>, ...C1], [ValidatorWrapper<K2>, ...C2]],
            | (keyof returnObject<BR, AR, K1> extends never
                  ? P1
                  : Omit<P1, keyof returnObject<BR, AR, K1>>)
            | (keyof returnObject<BR, AR, K2> extends never
                  ? P2
                  : Omit<P2, keyof returnObject<BR, AR, K2>>)
        >
        function alt(
            ...children: [
                Record<Validator<BR, AR>, ParserI<any, any, any>>,
                Record<Validator<BR, AR>, ParserI<any, any, any>>,
                ...Record<Validator<BR, AR>, ParserI<any, any, any>>[]
            ]
        ): ParserI<
            [
                ValidatorWrapper<Validator<BR, AR>>,
                ..._.RecursiveArray<Wrapped<any>>
            ][],
            any,
            boolean
        > {
            const keys = children.map((child) => Object.keys(child)[0])
            const parsers = children.map((child) => Object.values(child)[0])
            const alreadyConsumed = parsers.map((parser) => parser._consumed)
            const newConsumed = keys.map((key, i) => [
                { _tag: "validator", value: key },
                ...alreadyConsumed[i],
            ]) as [
                ValidatorWrapper<Validator<BR, AR>>,
                ...(Wrapped<any> | _.RecursiveArray<Wrapped<any>>)[]
            ][]

            return createParser(newConsumed, {})
        }

        const a = alt

        return { alt, a } as const
    },
} as const
