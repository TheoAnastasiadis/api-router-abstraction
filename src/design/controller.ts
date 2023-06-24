import { ParserI } from "../common/parser"
import { TaggedController } from "../common/wrappers"

/**
 * Helper function to create parsers from controllers.
 *
 * @param {function} fa The controller function. It must be have one argument of name args.
 *
 * @example
 * const getPostById = (args: {id: number}) => Promise.resolve(...);
 * const parser = controller(getPostById); //ParserI<[],{id:number},[]>
 */
export function controller<const P, const L extends string | undefined>(
    fa: (args: P) => any,
    label?: L
): ParserI<[TaggedController<typeof fa, typeof label>], Readonly<P>> {
    return {
        _consumed: [{ _tag: "Controller", value: fa, label }],
        _pending: {} as Readonly<P>, //The pending part of the parser doesn't exist at runtime.
    }
}
/**
 * @alias controller Alias of `controller` helper function
 *
 * @example
 * const getPostById = (args: {id: number}) => Promise.resolve(...);
 * const parser = f(getPostById); //ParserI<[],{id:number},[]>
 */
export const f = controller
