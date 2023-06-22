import { QueryT } from "../matchers/query"

export default function isQueryT(val: string): val is QueryT {
    return !!val.match(/^\?(?:\*=\S*&){0,}(?:.\S*=\S*)$/gm)
}
