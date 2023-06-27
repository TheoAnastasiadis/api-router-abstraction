import { BodyRegistry } from "../../src/common/bodyRegistry.types"
import { RequestT } from "../../src/common/request.consumed"
import { ParamT } from "../../src/matchers/param"
import { ParamValidator } from "../../src/validators/param.validator"

describe("URL Param validator", () => {
    const br: BodyRegistry = {}

    it("should narrow ParamT validators", () => {
        expect(ParamValidator.is("/:id(number)", br)).toBeTruthy()
        expect(ParamValidator.is("/posts", br)).toBeTruthy()
        expect(ParamValidator.is("?desc=true", br)).toBeFalsy()
    })

    it("should match good requests without type", () => {
        const request: RequestT = { path: "/posts/2?desc=true" }
        const Validator: ParamT = "/posts"
        const consumed = ParamValidator.consume(request, Validator, br)

        expect(consumed).toEqual({
            path: "/2?desc=true",
            consumed: {},
            healthy: true,
        })
    })

    it("should match good requests with number type", () => {
        const request: RequestT = { path: "/2?desc=true" }
        const Validator: ParamT = "/:id(number)"
        const consumed = ParamValidator.consume(request, Validator, br)

        expect(consumed).toEqual({
            path: "?desc=true",
            consumed: { id: 2 },
            healthy: true,
        })
    })

    it("should match good requests with string type", () => {
        const request: RequestT = { path: "/John?desc=true" }
        const Validator: ParamT = "/:username(string)"
        const consumed = ParamValidator.consume(request, Validator, br)

        expect(consumed).toEqual({
            path: "?desc=true",
            consumed: { username: "John" },
            healthy: true,
        })
    })

    it("should match good requests with boolean type", () => {
        const request: RequestT = { path: "/true?desc=true" }
        const Validator: ParamT = "/:safe(boolean)"
        const consumed = ParamValidator.consume(request, Validator, br)

        expect(consumed).toEqual({
            path: "?desc=true",
            consumed: { safe: true },
            healthy: true,
        })
    })

    it("should not match bad requests", () => {
        expect(
            ParamValidator.consume({ path: "/posts" }, "/news", br).healthy
        ).toBeFalsy()
        expect(
            ParamValidator.consume({ path: "/:id(number)" }, "/news", br)
                .healthy
        ).toBeFalsy()
        expect(
            ParamValidator.consume({ path: "/:safe(boolean)" }, "/news", br)
                .healthy
        ).toBeFalsy()
    })

    it("should generate from data", () => {
        expect(
            ParamValidator.format({ id: 3 }, "/:id(number)", { path: "/posts" })
        ).toEqual({ path: "/posts/3" })
    })

    it("should handle bad validators", () => {
        try {
            ParamValidator.format({ id: 3 }, "notAValidator" as ParamT, {
                path: "/posts",
            })
        } catch (error) {
            expect(error).toEqual(
                new TypeError(`Invalid ParamT matcher: ${"notAValidator"}`)
            )
        }
    })
})
