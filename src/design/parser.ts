/**
 * @interface
 * Interface for objects that represent route parsers.
 * Routes are consumed from P to C, optional label objects can be passed to the L param.
 *
 * @example
 * const foo : ParserI<[Validator], Object> = {_consumed: [Validator], _pending: Object, _labels: [], l:<...>}
 * const bar : ParserI<[Validator], Object, {label: Object}>  = foo.l("label")
 */
export interface ParserI<
    C,
    P,
    L extends Readonly<any[]> = [],
    includeL extends boolean = boolean
> {
    _consumed: C
    _pending: P
    _labels: L
    l: includeL extends true
        ? <const Name extends string>(
              n: Name
          ) => ParserI<C, P, [Record<Name, P>]>
        : undefined
}
/**
 * @function
 * Helper function for creating ParserI objects.
 *
 * @param {any} consumed The part of the route that has alreafy been consumed.
 * @param {any} pending The unconsumed part of the route
 * @param {any[]} [labels = []] Optional label object (see ParserI).
 */
export const createParser = <
    const C,
    const P,
    const L extends Readonly<Record<string, any>[]>
>(
    consumed: C,
    pending: P,
    labels: L
) =>
    ({
        _consumed: consumed,
        _pending: pending,
        _labels: labels,
        l: <const N extends string>(name: N) =>
            ({
                _consumed: consumed,
                _pending: pending,
                _labels: [{ [name]: pending } as Record<N, P>],
                l: undefined,
            } satisfies ParserI<C, P, [Record<N, P>], false>),
    } satisfies ParserI<C, P, typeof labels, true>)
