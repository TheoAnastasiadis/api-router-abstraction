import { ConsumedRequest, RequestT } from "../../src/parser/request"
import { chainValidate } from "../../src/parser/chainValidate"
import { bodyRegistry } from "../../src/validators/body"
import { authRegistry } from "../../src/validators/auth"
import { Validator } from "../../src/validators"

describe("chainValidate", () => {
    it("", () => {
        const request: RequestT = {
            path: "/posts/3?incognito=true",
            method: "GET",
        }
        const previousValidation = { ...request, consumed: {}, healthy: true }
        const bodyRegistry: bodyRegistry = {}
        const authRegistry: authRegistry = {}
        const crntIdx = 0
        const validators: Validator<
            typeof bodyRegistry,
            typeof authRegistry
        >[] = ["/posts", "/:id(number)"]
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
})
