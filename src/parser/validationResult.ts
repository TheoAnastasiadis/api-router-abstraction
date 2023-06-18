import { Validator } from "../validators"
import { authRegistry } from "../validators/auth"
import { bodyRegistry } from "../validators/body"

export type ValidationResult<
    BR extends bodyRegistry,
    AR extends authRegistry
> = {
    pending: string | false
    consumed: object
    level: _.RecursiveArray<Validator<BR, AR>>
    crntIdx: number
    br: BR
    ar: AR
}
