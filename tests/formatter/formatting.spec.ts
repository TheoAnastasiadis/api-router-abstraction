import { BodyRegistry } from "../../src/common/bodyRegistry.types"
import { format } from "../../src/formatter/formatting"
import * as t from "io-ts"

describe("formatting", () => {
    it("should format with all types of formatters", () => {
        const bodyRegistry: BodyRegistry = {
            post: {
                fields: t.type({
                    author: t.string,
                    date: t.string,
                    body: t.string,
                }),
            },
        }

        const body = {
            author: "John Doe",
            date: "1/1/1970",
            body: "Lorem ipsum...",
        }

        expect(
            format({ path: "" }).with("/:id(number)", { id: 4 }, bodyRegistry)
        ).toEqual({ path: "/4" })

        expect(
            format({ path: "/search" }).with(
                "?query=string!adult=boolean",
                { query: "anything" },
                bodyRegistry
            )
        ).toEqual({ path: "/search?query=anything" })

        expect(
            format({ path: "" }).with(
                "post_body",
                { id: 4, body },
                bodyRegistry
            )
        ).toEqual({ path: "", body })
    })
})
