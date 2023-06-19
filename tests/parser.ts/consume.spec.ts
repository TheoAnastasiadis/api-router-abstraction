import { consumeRoute } from "../../src/parser/consume"
import { Validator } from "../../src/validators"
import * as _ from "lodash"
import { bodyRegistry } from "../../src/validators/body"
import { authRegistry } from "../../src/validators/auth"

describe("consume route", () => {
    const request = { path: "/posts/2?incognito=false", method: "GET" }
    const bodyRegistry: bodyRegistry = {}
    const authRegistry: authRegistry = {}

    test("[routes that match] returns the consumed object", () => {
        const validators: _.RecursiveArray<
            Validator<typeof bodyRegistry, typeof authRegistry>
        > = ["GET", ["/posts", "/:id(number)", "?incognito=boolean"]]
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
            Validator<typeof bodyRegistry, typeof authRegistry>
        > = [
            "GET",
            ["/posts", "/:id(number)", ["/:author(string)", "?desc=boolean"]],
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
