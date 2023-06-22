import { createParser } from "../common/parser"

/**
 * Helper function to create parsers from controllers.
 *
 * @param {function} fa The controller function. It must be have one argument of name args.
 *
 * @example
 * const getPostById = (args: {id: number}) => Promise.resolve(...);
 * const parser = controller(getPostById); //ParserI<[],{id:number},[]>
 */
export function controller<const P>(fa: (args: P) => any) {
    return createParser([], {} as Readonly<P>) //The pending part of the parser doesn't exist at runtime.
}
/**
 * @alias controller Alias of `controller` helper function
 *
 * @example
 * const getPostById = (args: {id: number}) => Promise.resolve(...);
 * const parser = f(getPostById); //ParserI<[],{id:number},[]>
 */
export const f = controller
