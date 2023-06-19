import { RequestT } from "../../src/parser/request"
import { altValidate } from "../../src/parser/altValidate"
import { bodyRegistry } from "../../src/validators/body"
import { authRegistry } from "../../src/validators/auth"
import { Validator } from "../../src/validators"
import * as _ from "lodash"

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
            Validator<typeof bodyRegistry, typeof authRegistry>
        > = [["/posts", "/:id(number)"], "?desc=boolean!"]
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
        const validators: Validator<
            typeof bodyRegistry,
            typeof authRegistry
        >[] = ["/news", "?trending=boolean!"]
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
