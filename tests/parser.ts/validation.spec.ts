import { validate } from "../../src/parser/validation"

describe("validate function", () => {
    it("should validate with parameter validators", () => {
        const validation = validate({ path: "/posts/3?desc=true" }).with(
            "/posts"
        )
        expect(validation).toHaveProperty("path")
        expect(validation).toHaveProperty("consumed")
        expect(validation).toHaveProperty("healthy")
    })
    it("should validate with query validators", () => {
        const validation = validate({ path: "/posts/3?desc=true" }).with(
            "?desc=boolean!"
        )
        expect(validation).toHaveProperty("path")
        expect(validation).toHaveProperty("consumed")
        expect(validation).toHaveProperty("healthy")
    })
})
//