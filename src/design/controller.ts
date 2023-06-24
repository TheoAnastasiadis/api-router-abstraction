import { ParserI } from "../common/parser"
import { TaggedController } from "../common/wrappers"

export const notYetImplemented = () => {
    throw new Error("Functionality not yet implemented")
}

export type controllerRegistry = Readonly<
    Record<string, (args: any) => typeof notYetImplemented>
>

/**
 * Helper function to create parsers from controllers.
 *
 * @param {function} fa The controller function. It must be have one argument of name args.
 *
 * @example
 * const getPostById = (args: {id: number}) => Promise.resolve(...);
 * const parser = controller(getPostById); //ParserI<[],{id:number},[]>
 */
export const controller = {
    withConfig<const CR extends controllerRegistry>(cr: CR) {
        function controller<K extends keyof CR>(
            key: K & string
        ): ParserI<
            [TaggedController<CR[K], K & string>],
            Readonly<Parameters<CR[K]>[number]>
        > {
            return {
                _consumed: [{ _tag: "Controller", value: cr[key], label: key }],
                _pending: {} as Readonly<Parameters<CR[K]>[number]>, //The pending part of the parser doesn't exist at runtime.
            }
        }

        const f = controller

        return { controller, f }
    },
}

//======old version
// export function controller<const P, const L extends string | undefined>(
//     fa: (args: P, contrext?: any) => any,
//     label?: L
// ): ParserI<[TaggedController<typeof fa, typeof label>], Readonly<P>> {
//     return {
//         _consumed: [{ _tag: "Controller", value: fa, label }],
//         _pending: {} as Readonly<P>, //The pending part of the parser doesn't exist at runtime.
//     }
// }
/**
 * @alias controller Alias of `controller` helper function
 *
 * @example
 * const getPostById = (args: {id: number}) => Promise.resolve(...);
 * const parser = f(getPostById); //ParserI<[],{id:number},[]>
 */
//export const f = controller
