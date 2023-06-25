import { ParsingErrors, RequestT } from "../../src/common/request.consumed"
import { altValidate } from "../../src/parser/altValidate"
import { bodyRegistry } from "../../src/matchers/body"
import { authRegistry } from "../../src/matchers/auth"
import { Matcher } from "../../src/matchers"
import * as _ from "lodash"
import { TaggedMatcher } from "../../src/common/tagged.types"

describe("chainValidate", () => {
    const request: RequestT = {
        path: "/posts/3?incognito=true",
        method: "GET",
    }
    const previousValidation = {
        ...request,
        consumed: {},
        healthy: true,
    } as const
    const bodyRegistry: bodyRegistry = {}
    const authRegistry: authRegistry = {}
    const crntIdx = 0

    it("consumes matching requests", () => {
        const validators: _.RecursiveArray<
            TaggedMatcher<Matcher<typeof bodyRegistry, typeof authRegistry>>
        > = [
            [
                { _tag: "Matcher", value: "/posts" },
                { _tag: "Matcher", value: "/:id(number)" },
            ],
            { _tag: "Matcher", value: "?desc=boolean!" },
        ]
        const result1 = altValidate(
            previousValidation,
            validators,
            bodyRegistry,
            authRegistry,
            crntIdx
        )
        expect(result1).toEqual({
            consumedRequest: {
                path: "/3?incognito=true",
                method: "GET",
                consumed: {},
                healthy: true,
            },
            newLevel: validators[0],
            nextIdx: 1,
        })
    })

    it("consumes non matching requests", () => {
        const validators: _.RecursiveArray<
            TaggedMatcher<Matcher<typeof bodyRegistry, typeof authRegistry>>
        > = [
            { _tag: "Matcher", value: "/news" },
            { _tag: "Matcher", value: "?trending=boolean!" },
        ]
        const result1 = altValidate(
            previousValidation,
            validators,
            bodyRegistry,
            authRegistry,
            crntIdx
        )
        expect(result1).toEqual({
            consumedRequest: {
                path: "/posts/3?incognito=true",
                method: "GET",
                consumed: {},
                healthy: false,
                error: ParsingErrors.PATH_ERROR,
            },
            newLevel: validators,
            nextIdx: 1,
        })
    })
})
