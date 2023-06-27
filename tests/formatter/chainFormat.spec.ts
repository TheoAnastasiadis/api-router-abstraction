import { TaggedMatcher } from "../../src/common/tagged.types"
import { chainFormat } from "../../src/formatter/chainFormat"
import { Matcher } from "../../src/matchers"

describe("chain formatter", () => {
    it("should format consecutive validators", () => {
        const validators: TaggedMatcher<Matcher<{}>>[] = [
            { _tag: "Matcher", value: "/posts" },
            { _tag: "Matcher", value: "/:id(number)" },
            { _tag: "Matcher", value: "GET" },
        ]

        const data = { id: 4 }

        expect(chainFormat({ path: "" }, validators[0], data, {}, 0)).toEqual({
            consumedResponse: { path: "/posts" },
            nextIdx: 1,
        })

        expect(
            chainFormat({ path: "/posts" }, validators[1], data, {}, 1)
        ).toEqual({ consumedResponse: { path: "/posts/4" }, nextIdx: 2 })

        expect(
            chainFormat({ path: "/posts/4" }, validators[2], data, {}, 2)
        ).toEqual({
            consumedResponse: { path: "/posts/4", method: "GET" },
            nextIdx: 3,
        })
    })
})
