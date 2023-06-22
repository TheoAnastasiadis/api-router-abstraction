import { ParamT } from "../matchers/param"

export default function isParamT(val: string): val is ParamT {
    return !!val.match(
        /\/(?:(?:(?:[a-zA-z0-9]*)$)|(?::\w*?\((?:(?:number)|(?:string)|(?:boolean))\)$))/gm
    )
}
