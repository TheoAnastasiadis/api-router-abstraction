import { ParserI } from "./design/parser"
import { consumeRoute } from "./parser/consume"
import { Validator } from "./validators"
import { authRegistry } from "./validators/auth"
import { bodyRegistry } from "./validators/body"
import * as _ from "lodash"

export class Router<BR extends bodyRegistry, AR extends authRegistry> {
    private validators: _.RecursiveArray<Validator<BR, AR>>
    private labels: any[]
    private bodyRegistry: BR
    private authRegistry: AR
    constructor(
        parser: ParserI<any, Record<string, never>, any>,
        br: BR,
        ar: AR
    ) {
        this.validators = parser._consumed
        this.labels = parser._labels
        this.bodyRegistry = br
        this.authRegistry = ar
    }
    parse(route: string, method?: string, body?: string) {
        //first call on the recursion
        return consumeRoute({
            pending: route,
            consumed: {},
            level: this.validators,
            crntIdx: 0,
            br: this.bodyRegistry,
            ar: this.authRegistry,
        })
    }
}
