import { BodyRegistry } from "../../src/common/bodyRegistry.types"
import { QueryValidator } from "../../src/validators/query.validator"

describe("QueryValidator", () => {
    const br: BodyRegistry = {}

    it("should be able to narrow query validators", () => {
        expect(
            QueryValidator.is("?artist=string!&?desc=boolean", br)
        ).toBeTruthy()
        expect(QueryValidator.is("?from=string&to=string", br)).toBeTruthy()
        expect(QueryValidator.is("/homepage", br)).toBeFalsy()
    })

    it("should match good requests with boolean type", () => {
        const validator = "?desc=boolean!&allowAdult=boolean"
        const validation = QueryValidator.consume(
            { path: "/posts?desc=true" },
            validator,
            br
        )

        expect(validation).toEqual({
            path: "/posts?desc=true",
            consumed: { desc: true },
            healthy: true,
        })
    })

    it("should match good requests with number type", () => {
        const validator = "?page=number!&allowAdult=boolean"
        const validation = QueryValidator.consume(
            { path: "/posts?page=3" },
            validator,
            br
        )

        expect(validation).toEqual({
            path: "/posts?page=3",
            consumed: { page: 3 },
            healthy: true,
        })
    })

    it("should match good requests with string type", () => {
        const validator = "?from=string!&allowAdult=boolean"
        const validation = QueryValidator.consume(
            { path: "/posts?from=2020-16-3" },
            validator,
            br
        )

        expect(validation).toEqual({
            path: "/posts?from=2020-16-3",
            consumed: { from: "2020-16-3" },
            healthy: true,
        })
    })

    it("should not match bad requests", () => {
        expect(
            QueryValidator.consume(
                { path: "/news/today" },
                "?from=string!&to=string!",
                br
            ).healthy
        ).toBeFalsy()
        expect(
            QueryValidator.consume(
                { path: "?from=a&to=b" },
                "?from=number&to=number",
                br
            ).healthy
        ).toBeFalsy()
        expect(
            QueryValidator.consume(
                { path: "?desc=true" },
                "?locale=string!&desc=boolean",
                br
            ).healthy
        ).toBeFalsy()
        expect(
            QueryValidator.consume(
                { path: "?order_desc=yes" },
                "?order_desc=boolean!",
                br
            ).healthy
        ).toBeFalsy()
    })

    it("should generate from data", () => {
        expect(
            QueryValidator.format(
                { locale: "en-US", desc: true },
                "?locale=string!&desc=boolean",
                { path: "/posts/4" }
            )
        ).toEqual({ path: "/posts/4?locale=en-US&desc=true" })
    })
})
