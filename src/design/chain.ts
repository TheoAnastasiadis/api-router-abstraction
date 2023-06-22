import { Validator } from "../validators"
import { authRegistry } from "../validators/auth"
import { bodyRegistry } from "../validators/body"
import { combineReturnObjects, returnObject } from "../validators/returnObject"
import { ParserI, createParser } from "../common/parser"
import { Wrapped, ValidatorWrapper } from "../common/wrappers"
import * as _ from "lodash"

export const chain = {
    withConfig<BR extends bodyRegistry, AR extends authRegistry>(
        br: BR,
        ar: AR
    ) {
        function chain<
            const K extends Validator<BR, AR>,
            const P extends Record<string, any>,
            const C extends _.RecursiveArray<Wrapped<any>>
        >(
            child: Record<
                K,
                ParserI<C, combineReturnObjects<[P, returnObject<BR, AR, K>]>>
            >
        ): ParserI<
            [ValidatorWrapper<K>, ...C],
            keyof returnObject<BR, AR, K> extends never
                ? P
                : Omit<P, keyof returnObject<BR, AR, K>>,
            boolean
        > {
            const validator = Object.keys(child)[0] as keyof typeof child
            const consumed = child[validator]._consumed

            return createParser(
                [{ _tag: "validator", value: validator }, ...consumed],
                {} as keyof returnObject<BR, AR, K> extends never
                    ? P
                    : Omit<P, keyof returnObject<BR, AR, K>> //this exists only at compile time
            ) as ParserI<
                [ValidatorWrapper<K>, ...C],
                keyof returnObject<BR, AR, K> extends never
                    ? P
                    : Omit<P, keyof returnObject<BR, AR, K>>,
                boolean
            >
        }

        const c = chain

        return { chain, c } as const
    },
} as const
