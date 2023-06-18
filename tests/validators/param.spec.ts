import { RequestT } from "../../src/parser/request"
import { ParamT, ParamValidator } from "../../src/validators/param"

describe("URL Param validator", () => {
    it("should narrow ParamT validators", () => {
        expect(ParamValidator.is("/:id(number)")).toBeTruthy()
        expect(ParamValidator.is("/posts")).toBeTruthy()
        expect(ParamValidator.is("?desc=true")).toBeTruthy()
    })

    it("should consume matching requests without type", () => {
        const request: RequestT = { path: "/posts/2?desc=true" }
        const Validator: ParamT = "/posts"
        const consumed = ParamValidator.consume(request, Validator)

        expect(consumed).toEqual({
            path: "/2?desc=true",
            consumed: {},
            healthy: true,
        })
    })

    it("should consume matching requests with number type", () => {
        const request: RequestT = { path: "/2?desc=true" }
        const Validator: ParamT = "/:id(number)"
        const consumed = ParamValidator.consume(request, Validator)

        expect(consumed).toEqual({
            path: "?desc=true",
            consumed: { id: 2 },
            healthy: true,
        })
    })

    it("should consume matching requests with string type", () => {
        const request: RequestT = { path: "/John?desc=true" }
        const Validator: ParamT = "/:username(string)"
        const consumed = ParamValidator.consume(request, Validator)

        expect(consumed).toEqual({
            path: "?desc=true",
            consumed: { username: "John" },
            healthy: true,
        })
    })

    it("should consume matching requests with boolean type", () => {
        const request: RequestT = { path: "/true?desc=true" }
        const Validator: ParamT = "/:safe(boolean)"
        const consumed = ParamValidator.consume(request, Validator)

        expect(consumed).toEqual({
            path: "?desc=true",
            consumed: { safe: true },
            healthy: true,
        })
    })

    it("should consume non matching requests", () => {
        expect(
            ParamValidator.consume({ path: "/posts" }, "/news").healthy
        ).toBeFalsy()
        expect(
            ParamValidator.consume({ path: "/:id(number)" }, "/news").healthy
        ).toBeFalsy()
        expect(
            ParamValidator.consume({ path: "/:safe(boolean)" }, "/news").healthy
        ).toBeFalsy()
    })
})
