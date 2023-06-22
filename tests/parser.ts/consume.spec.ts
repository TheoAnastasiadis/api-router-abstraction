import { consumeRoute } from "../../src/parser/consume"
import { Validator } from "../../src/validators"
import { bodyRegistry } from "../../src/validators/body"
import { authRegistry } from "../../src/validators/auth"
import * as _ from "lodash"
import { ValidatorWrapper } from "../../src/common/wrappers"

describe("consume route", () => {
    const request = { path: "/posts/2?incognito=false", method: "GET" }
    const bodyRegistry: bodyRegistry = {}
    const authRegistry: authRegistry = {}

    test("[routes that match] returns the consumed object", () => {
        const validators: _.RecursiveArray<
            ValidatorWrapper<
                Validator<typeof bodyRegistry, typeof authRegistry>
            >
        > = [
            { _tag: "validator", value: "GET" },
            [
                { _tag: "validator", value: "/posts" },
                { _tag: "validator", value: "/:id(number)" },
                { _tag: "validator", value: "?incognito=boolean" },
            ],
        ]
        const result = consumeRoute(
            request,
            validators,
            bodyRegistry,
            authRegistry
        )

        expect(result).toEqual({
            id: 2,
            incognito: false,
        })
    })

    test("[routes that don't match] returns false", () => {
        const validators: _.RecursiveArray<
            ValidatorWrapper<
                Validator<typeof bodyRegistry, typeof authRegistry>
            >
        > = [
            { _tag: "validator", value: "GET" },
            [
                { _tag: "validator", value: "/posts" },
                { _tag: "validator", value: "/:id(number)" },
                [
                    { _tag: "validator", value: "/:author(string)" },
                    { _tag: "validator", value: "?desc=boolean" },
                ],
            ],
        ]
        const result = consumeRoute(
            request,
            validators,
            bodyRegistry,
            authRegistry
        )

        expect(result).toEqual(false)
    })
})
