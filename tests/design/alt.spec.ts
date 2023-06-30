import * as _ from "lodash"
import { alt } from "../../src/design/alt"

describe("Alt Helper", () => {
    it("should return a valid parser for a alt", () => {
        const cr = {}
        const br = {}
        const parser = alt.withConfig(cr, br)

        const result = parser.a(
            {
                "/posts": {
                    _consumed: [{ _tag: "Matcher", value: "/:id(number)" }],
                    _pending: {},
                },
            },
            {
                "/users": {
                    _consumed: [{ _tag: "Matcher", value: "/:id(number)" }],
                    _pending: {},
                },
            }
        )

        // Assert that the result matches the expected output
        expect(result).toEqual({
            _consumed: [
                [
                    { _tag: "Matcher", value: "/posts" },
                    { _tag: "Matcher", value: "/:id(number)" },
                ],
                [
                    { _tag: "Matcher", value: "/users" },
                    { _tag: "Matcher", value: "/:id(number)" },
                ],
            ],
            _pending: {},
        })
    })
})
