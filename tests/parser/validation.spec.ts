import { validate } from "../../src/parser/validation"
import { bodyRegistry } from "../../src/matchers/body"
import * as t from "io-ts"

describe("validate function", () => {
    const request = {
        path: "/posts/3?desc=true",
        method: "GET",
        body: {
            name: "John",
            surname: "Doe",
            age: 99,
        },
    }

    const br: bodyRegistry = {
        user: t.type({
            name: t.string,
            surname: t.string,
            age: t.number,
        }),
    }

    const consumedRequest = { ...request, healthy: true, consumed: {} } as const

    it("should validate with parameter validators", () => {
        const validation = validate(consumedRequest).with("/posts", br)
        expect(validation.healthy).toBeTruthy()
    })
    it("should validate with query validators", () => {
        const validation = validate(consumedRequest).with("?desc=boolean!", br)
        expect(validation.healthy).toBeTruthy()
    })
    it("should validate with param validators", () => {
        const validation = validate(consumedRequest).with("GET", br)
        expect(validation.healthy).toBeTruthy()
    })
    it("should validate with body validators", () => {
        const validation = validate(consumedRequest).with("user_body", br)
        expect(validation.healthy).toBeTruthy()
    })
})
//
