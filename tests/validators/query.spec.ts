import { QueryValidator } from "../../src/validators/query"

describe("QueryValidator", () => {
    it("should be able to narrow query validators", () => {
        expect(QueryValidator.is("?artist=string!&?desc=boolean")).toBeTruthy()
        expect(QueryValidator.is("?from=string&to=string")).toBeTruthy()
        expect(QueryValidator.is("/homepage")).toBeFalsy()
    })

    it("should consume matching paths with boolean type", () => {
        const validator = "?desc=boolean!&allowAdult=boolean"
        const validation = QueryValidator.consume(
            { path: "/posts?desc=true" },
            validator
        )

        expect(validation).toEqual({
            path: "/posts?desc=true",
            consumed: { desc: true },
            healthy: true,
        })
    })

    it("should consume matching paths with number type", () => {
        const validator = "?page=number!&allowAdult=boolean"
        const validation = QueryValidator.consume(
            { path: "/posts?page=3" },
            validator
        )

        expect(validation).toEqual({
            path: "/posts?page=3",
            consumed: { page: 3 },
            healthy: true,
        })
    })

    it("should consume matching paths with string type", () => {
        const validator = "?from=string!&allowAdult=boolean"
        const validation = QueryValidator.consume(
            { path: "/posts?from=2020-16-3" },
            validator
        )

        expect(validation).toEqual({
            path: "/posts?from=2020-16-3",
            consumed: { from: "2020-16-3" },
            healthy: true,
        })
    })

    it("should consume non matching paths", () => {
        expect(
            QueryValidator.consume(
                { path: "/news/today" },
                "?from=string!&to=string!"
            ).healthy
        ).toBeFalsy()
        expect(
            QueryValidator.consume(
                { path: "?desc=true" },
                "?locale=string!&desc=boolean"
            ).healthy
        ).toBeFalsy()
    })
})
