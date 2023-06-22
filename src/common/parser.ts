import { LabelWrapper, Wrapped } from "./wrappers"
import * as _ from "lodash"

/**
 * @interface
 * Interface for objects that represent route parsers.
 * Routes are consumed from P to C.
 *
 * @example
 * const foo : ParserI<[Validator], Object> = {_consumed: [Validator], _pending: Object, l:<...>}
 * const bar : ParserI<[Validator, LabelWrapper<"label">], Object>  = foo.l("label")
 */
export interface ParserI<
    C extends _.RecursiveArray<Wrapped<any>>,
    P,
    includeL extends boolean = true
> {
    _consumed: C
    _pending: P
    l: includeL extends true
        ? <const Name extends string>(
              n: Name
          ) => ParserI<[...C, LabelWrapper<Name>], P, false>
        : undefined
}
/**
 * @function
 * Helper function for creating ParserI objects.
 *
 * @param {any} consumed The part of the route that has alreafy been consumed.
 * @param {any} pending The unconsumed part of the route
 */
export function createParser<
    const C extends _.RecursiveArray<Wrapped<any>>,
    const P
>(consumed: C, pending: P): ParserI<C, P> {
    return {
        _consumed: consumed,
        _pending: pending,
        l: <const N extends string>(name: N) => ({
            _consumed: [...consumed, { _tag: "label", value: name }] as [
                ...C,
                LabelWrapper<N>
            ],
            _pending: pending,
            l: undefined,
        }),
    }
}
