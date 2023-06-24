import * as _ from "lodash"

/**
 * @interface
 * Interface for objects that represent route parsers.
 * Routes are consumed from P to C.
 */
export interface ParserI<C extends Readonly<[..._.RecursiveArray<any>]>, P> {
    _consumed: C
    _pending: P
}
