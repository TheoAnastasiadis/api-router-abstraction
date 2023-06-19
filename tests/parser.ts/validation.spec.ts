import { validate } from "../../src/parser/validation"

describe("validate function", () => {
    const request = { path: "/posts/3?desc=true", method: "GET" }

    it("should validate with parameter validators", () => {
        const validation = validate(request).with("/posts")
        expect(validation.healthy).toBeTruthy()
    })
    it("should validate with query validators", () => {
        const validation = validate(request).with("?desc=boolean!")
        expect(validation.healthy).toBeTruthy()
    })
    it("should validate with param validators", () => {
        const validation = validate(request).with("GET")
        expect(validation.healthy).toBeTruthy()
    })
})
//
