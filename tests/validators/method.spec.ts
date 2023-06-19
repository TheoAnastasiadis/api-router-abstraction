import { MethodValidator } from "../../src/validators/method"

describe("MethodVaidator", () => {
    it("should narrow Method validators", () => {
        expect(MethodValidator.is("GET")).toBeTruthy()
        expect(MethodValidator.is("POST,DELETE")).toBeTruthy()
        expect(MethodValidator.is("/posts/:username(string)")).toBeFalsy()
    })

    it("should consume good requests", () => {
        expect(
            MethodValidator.consume({ path: "/posts", method: "GET" }, "GET")
        ).toEqual({
            path: "/posts",
            method: "GET",
            consumed: {},
            healthy: true,
        })
        expect(
            MethodValidator.consume(
                { path: "/posts/4", method: "POST" },
                "GET,POST"
            )
        ).toEqual({
            path: "/posts/4",
            method: "POST",
            consumed: {},
            healthy: true,
        })
    })

    it("should consume bad requests", () => {
        expect(
            MethodValidator.consume(
                { path: "/posts?soft=true", method: "POST" },
                "DELETE"
            )
        ).toEqual({
            path: "/posts?soft=true",
            method: "POST",
            consumed: {},
            healthy: false,
        })
    })
})