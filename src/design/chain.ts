import { Validator } from "../validators"
import { authRegistry } from "../validators/auth"
import { bodyRegistry } from "../validators/body"
import { combineReturnObjects, returnObject } from "../validators/returnObject"
import { ParserI, createParser } from "./parser"

export const chain = {
    withConfig<BR extends bodyRegistry, AR extends authRegistry>(
        br: BR,
        ar: AR
    ) {
        function chain<
            const K extends Validator<BR, AR>,
            const P extends Record<string, any>,
            const C extends Readonly<any[]>,
            const L extends Readonly<any[]>
        >(
            child: Record<
                K,
                ParserI<
                    C,
                    combineReturnObjects<[P, returnObject<BR, AR, K>]>,
                    L
                >
            >
        ): ParserI<
            readonly [K, ...C],
            Omit<P, keyof returnObject<BR, AR, K>>,
            L
        > {
            const validator = Object.keys(child)[0] as keyof typeof child
            const consumed = child[validator]._consumed
            const labels = child[validator]._labels

            return createParser(
                [validator, ...consumed] as const,
                {} as Omit<P, keyof returnObject<BR, AR, K>>,
                labels
            )
        }

        const c = chain

        return { chain, c } as const
    },
} as const
