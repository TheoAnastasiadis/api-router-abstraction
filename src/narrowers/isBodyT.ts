import { BodyT, bodyRegistry } from "../matchers/body"

export default function isBodyT<BR extends bodyRegistry>(
    val: string,
    bodyRegistry?: BR
): val is BodyT<BR> {
    const { validatorKey } = val.match(/(?<validatorKey>\w*?)_body/)
        ?.groups || { validatorKey: undefined }
    const registryKeys = Object.keys(bodyRegistry || {})

    return (
        !!bodyRegistry && !!validatorKey && registryKeys.includes(validatorKey)
    )
}
