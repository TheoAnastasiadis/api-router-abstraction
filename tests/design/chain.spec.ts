import * as _ from "lodash"
import { chain } from "../../src/design/chain"

describe("Chain Helper", () => {
    it("should return a valid parser for a chain", () => {
        const cr = {}
        const br = {}
        const parser = chain.withConfig(cr, br)

        const result = parser.c({
            "/posts": {
                _consumed: [],
                _pending: {},
            },
        })

        // Assert that the result matches the expected output
        expect(result).toEqual({
            _consumed: [{ _tag: "Matcher", value: "/posts" }],
            _pending: {},
        })
    })
})
