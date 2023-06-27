import { consumeRoute } from "../../src/parser"
import { Matcher } from "../../src/matchers"
import * as _ from "lodash"
import { TaggedController, TaggedMatcher } from "../../src/common/tagged.types"
import { ParsingErrors } from "../../src/common/request.consumed"
import { BodyRegistry } from "../../src/common/bodyRegistry.types"

type Validators<BR extends BodyRegistry> = readonly [
    ..._.RecursiveArray<TaggedMatcher<Matcher<BR>> | TaggedController<any>>
]

describe("consume route", () => {
    const request = { path: "/posts/2?incognito=false", method: "GET" }
    const bodyRegistry: BodyRegistry = {}

    test("[routes that match] returns the consumed object", () => {
        const validators: Validators<typeof bodyRegistry> = [
            { _tag: "Matcher", value: "GET" },
            [
                { _tag: "Matcher", value: "/posts" },
                { _tag: "Matcher", value: "/:id(number)" },
                { _tag: "Matcher", value: "?incognito=boolean" },
                {
                    _tag: "Controller",
                    label: "getPostsById",
                },
            ],
        ]
        const result = consumeRoute(request, validators, bodyRegistry)

        expect(result).toEqual({
            _tag: "Right",
            right: {
                consumed: {
                    id: 2,
                    incognito: false,
                },
                controller: "getPostsById",
            },
        })
    })

    test("[routes that don't match] returns false", () => {
        const validators: _.RecursiveArray<
            TaggedMatcher<Matcher<typeof bodyRegistry>>
        > = [
            { _tag: "Matcher", value: "GET" },
            [
                { _tag: "Matcher", value: "/posts" },
                { _tag: "Matcher", value: "/:id(number)" },
                [
                    { _tag: "Matcher", value: "/:author(string)" },
                    { _tag: "Matcher", value: "?desc=boolean" },
                ],
            ],
        ]
        const result = consumeRoute(request, validators, bodyRegistry)

        expect(result).toEqual({
            _tag: "Left",
            left: ParsingErrors.PATH_ERROR,
        })
    })
})
