import { BodyRegistry } from "../../src/common/bodyRegistry.types"
import { ParsingErrors } from "../../src/common/request.consumed"
import { MethodValidator } from "../../src/validators/method.validator"

describe("MethodVaidator", () => {
    const br: BodyRegistry = {}

    it("should narrow Method validators", () => {
        expect(MethodValidator.is("GET", br)).toBeTruthy()
        expect(MethodValidator.is("POST,DELETE", br)).toBeTruthy()
        expect(MethodValidator.is("/posts/:username(string)", br)).toBeFalsy()
    })

    it("should match good requests", () => {
        expect(
            MethodValidator.consume(
                { path: "/posts", method: "GET" },
                "GET",
                br
            )
        ).toEqual({
            path: "/posts",
            method: "GET",
            consumed: {},
            healthy: true,
        })
        expect(
            MethodValidator.consume(
                { path: "/posts/4", method: "POST" },
                "GET,POST",
                br
            )
        ).toEqual({
            path: "/posts/4",
            method: "POST",
            consumed: {},
            healthy: true,
        })
    })

    it("should not match bad requests", () => {
        expect(
            MethodValidator.consume(
                { path: "/posts?soft=true", method: "POST" },
                "DELETE",
                br
            )
        ).toEqual({
            path: "/posts?soft=true",
            method: "POST",
            consumed: {},
            healthy: false,
            error: ParsingErrors.METHOD_ERROR,
        })
    })

    it("should generate from data", () => {
        expect(MethodValidator.format({}, "POST,PUT", { path: "" })).toEqual({
            path: "",
            method: "POST",
        })
    })
})
