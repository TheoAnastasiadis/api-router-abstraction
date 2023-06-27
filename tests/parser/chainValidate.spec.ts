import { ParsingErrors, RequestT } from "../../src/common/request.consumed"
import { chainValidate } from "../../src/parser/chainValidate"
import { Matcher } from "../../src/matchers"
import { TaggedMatcher } from "../../src/common/tagged.types"
import { BodyRegistry } from "../../src/common/bodyRegistry.types"

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
    const bodyRegistry: BodyRegistry = {}
    const crntIdx = 0

    it("consumes matching requests", () => {
        const validators: TaggedMatcher<Matcher<typeof bodyRegistry>>[] = [
            { _tag: "Matcher", value: "/posts" },
            { _tag: "Matcher", value: "/:id(number)" },
        ]
        const result1 = chainValidate(
            previousValidation,
            validators[0],
            bodyRegistry,
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
        const validators: TaggedMatcher<Matcher<typeof bodyRegistry>>[] = [
            { _tag: "Matcher", value: "/posts" },
            { _tag: "Matcher", value: "/:onlyNew(boolean)" },
        ]
        const result1 = chainValidate(
            previousValidation,
            validators[0],
            bodyRegistry,
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

    it("can handle already failed requests", () => {
        const validators = [
            { _tag: "Matcher", value: "/news" },
            { _tag: "Matcher", value: "?trending=boolean!" },
        ] as const

        const alreadyFailedVal = {
            ...previousValidation,
            healthy: false,
            error: ParsingErrors.UNKNOWN_ERROR,
        }
        const result = chainValidate(
            alreadyFailedVal,
            validators[0],
            bodyRegistry,
            crntIdx
        )
        expect(result).toEqual({
            consumedRequest: alreadyFailedVal,
            nextIdx: 1,
        })
    })
})
