import { TaggedController, TaggedMatcher } from "../../src/common/tagged.types"
import { altFormat } from "../../src/formatter/altFormat"
import { Matcher } from "../../src/matchers"
import * as _ from "lodash"

describe("alt formatter", () => {
    it("should format in parallel", () => {
        const validators: [
            ..._.RecursiveArray<
                TaggedMatcher<Matcher<{}>> | TaggedController<string>
            >
        ] = [
            [{ _tag: "Matcher", value: "/posts" }],
            [
                { _tag: "Matcher", value: "/:id(number)" },
                { _tag: "Matcher", value: "GET" },
                { _tag: "Controller", label: "FLAG" },
            ],
        ]

        const data = { id: 4 }

        expect(altFormat({ path: "" }, validators, "FLAG")).toEqual({
            consumedResponse: { path: "" },
            nextIdx: 0,
            newLevel: validators[1],
        })
    })
})
