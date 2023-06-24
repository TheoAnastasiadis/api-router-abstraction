import { consumeRoute } from "../../src/parser"
import { Matcher } from "../../src/matchers"
import { bodyRegistry } from "../../src/matchers/body"
import { authRegistry } from "../../src/matchers/auth"
import * as _ from "lodash"
import { TaggedMatcher } from "../../src/common/wrappers"

describe("consume route", () => {
    const request = { path: "/posts/2?incognito=false", method: "GET" }
    const bodyRegistry: bodyRegistry = {}
    const authRegistry: authRegistry = {}

    test("[routes that match] returns the consumed object", () => {
        const validators: _.RecursiveArray<
            TaggedMatcher<Matcher<typeof bodyRegistry, typeof authRegistry>>
        > = [
            { _tag: "Matcher", value: "GET" },
            [
                { _tag: "Matcher", value: "/posts" },
                { _tag: "Matcher", value: "/:id(number)" },
                { _tag: "Matcher", value: "?incognito=boolean" },
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
            TaggedMatcher<Matcher<typeof bodyRegistry, typeof authRegistry>>
        > = [
            { _tag: "Matcher", value: "GET" },
            [
                { _tag: "Matcher", value: "/posts" },
                { _tag: "Matcher", value: "/:id(number)" },
                [
                    { _tag: "Matcher", value: "/:author(string)" },
                    { _tag: "Matcher", value: "?desc=boolean" },
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
