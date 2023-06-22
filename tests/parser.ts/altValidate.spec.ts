import { RequestT } from "../../src/common/request"
import { altValidate } from "../../src/parser/altValidate"
import { bodyRegistry } from "../../src/matchers/body"
import { authRegistry } from "../../src/matchers/auth"
import { Matcher } from "../../src/matchers"
import * as _ from "lodash"
import { ValidatorWrapper } from "../../src/common/wrappers"

describe("chainValidate", () => {
    const request: RequestT = {
        path: "/posts/3?incognito=true",
        method: "GET",
    }
    const previousValidation = { ...request, consumed: {}, healthy: true }
    const bodyRegistry: bodyRegistry = {}
    const authRegistry: authRegistry = {}
    const crntIdx = 0

    it("consumes matching requests", () => {
        const validators: _.RecursiveArray<
            ValidatorWrapper<Matcher<typeof bodyRegistry, typeof authRegistry>>
        > = [
            [
                { _tag: "validator", value: "/posts" },
                { _tag: "validator", value: "/:id(number)" },
            ],
            { _tag: "validator", value: "?desc=boolean!" },
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
            ValidatorWrapper<Matcher<typeof bodyRegistry, typeof authRegistry>>
        > = [
            { _tag: "validator", value: "/news" },
            { _tag: "validator", value: "?trending=boolean!" },
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
            },
            newLevel: validators,
            nextIdx: 1,
        })
    })
})
