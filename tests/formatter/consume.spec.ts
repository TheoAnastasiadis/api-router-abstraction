import { TaggedController, TaggedMatcher } from "../../src/common/tagged.types"
import { consumeFormatters } from "../../src/formatter"
import { Matcher } from "../../src/matchers"

describe("consumeFormatters", () => {
    it("should format with all types of formatters", () => {
        const validators = [
            { _tag: "Matcher", value: "/posts" },
            { _tag: "Matcher", value: "/:id(number)" },
            [
                { _tag: "Matcher", value: "NotAValidator" },
                { _tag: "Controller", label: "FLAG" },
                { _tag: "Matcher", value: "GET" },
            ],
        ] as [
            ..._.RecursiveArray<
                TaggedController<any> | TaggedMatcher<Matcher<{}>>
            >
        ]

        expect(consumeFormatters(validators, { id: 2 }, "FLAG", {})).toEqual({
            path: "/posts/2",
            body: undefined,
        })
    })
})
