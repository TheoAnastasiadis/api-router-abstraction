import { ParsingErrors, RequestT } from "../../src/common/request.consumed"
import { chainValidate } from "../../src/parser/chainValidate"
import { bodyRegistry } from "../../src/matchers/body"
import { authRegistry } from "../../src/matchers/auth"
import { Matcher } from "../../src/matchers"
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
        const validators: TaggedMatcher<
            Matcher<typeof bodyRegistry, typeof authRegistry>
        >[] = [
            { _tag: "Matcher", value: "/posts" },
            { _tag: "Matcher", value: "/:id(number)" },
        ]
        const result1 = chainValidate(
            previousValidation,
            validators[0],
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
            nextIdx: 1,
        })
        const result2 = chainValidate(
            result1.consumedRequest,
            validators[1],
            bodyRegistry,
            authRegistry,
            result1.nextIdx
        )
        expect(result2).toEqual({
            consumedRequest: {
                path: "?incognito=true",
                method: "GET",
                consumed: { id: 3 },
                healthy: true,
            },
            nextIdx: 2,
        })
    })

    it("consumes non matching requests", () => {
        const validators: TaggedMatcher<
            Matcher<typeof bodyRegistry, typeof authRegistry>
        >[] = [
            { _tag: "Matcher", value: "/posts" },
            { _tag: "Matcher", value: "/:onlyNew(boolean)" },
        ]
        const result1 = chainValidate(
            previousValidation,
            validators[0],
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
            nextIdx: 1,
        })
        const result2 = chainValidate(
            result1.consumedRequest,
            validators[1],
            bodyRegistry,
            authRegistry,
            result1.nextIdx
        )
        expect(result2).toEqual({
            consumedRequest: {
                path: "?incognito=true",
                method: "GET",
                consumed: {
                    onlyNew: false,
                },
                healthy: false,
                error: ParsingErrors.PATH_ERROR,
            },
            nextIdx: 2,
        })
    })
})
