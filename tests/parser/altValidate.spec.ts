import { ParsingErrors, RequestT } from "../../src/common/request.consumed"
import { altValidate } from "../../src/parser/altValidate"
import { Matcher } from "../../src/matchers"
import * as _ from "lodash"
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
        const validators: _.RecursiveArray<
            TaggedMatcher<Matcher<typeof bodyRegistry>>
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
            TaggedMatcher<Matcher<typeof bodyRegistry>>
        > = [
            { _tag: "Matcher", value: "/news" },
            { _tag: "Matcher", value: "?trending=boolean!" },
        ]
        const result1 = altValidate(
            previousValidation,
            validators,
            bodyRegistry,
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

    it("can handle already failed requests", () => {
        const validators: _.RecursiveArray<
            TaggedMatcher<Matcher<typeof bodyRegistry>>
        > = [
            { _tag: "Matcher", value: "/news" },
            { _tag: "Matcher", value: "?trending=boolean!" },
        ]

        const alreadyFailedVal = {
            ...previousValidation,
            healthy: false,
            error: ParsingErrors.UNKNOWN_ERROR,
        }
        const result = altValidate(
            alreadyFailedVal,
            validators,
            bodyRegistry,
            crntIdx
        )
        expect(result).toEqual({
            consumedRequest: alreadyFailedVal,
            newLevel: validators,
            nextIdx: 1,
        })
    })

    it("can handle validators of unexpected shape", () => {
        const validators = [{ _tag: "Controller", label: "FLAG" } as const]

        const result = altValidate(
            previousValidation,
            validators,
            bodyRegistry,
            0
        )
        expect(result).toEqual({
            consumedRequest: { ...previousValidation, controller: "FLAG" },
            newLevel: validators,
            nextIdx: 1,
        })
    })
})
