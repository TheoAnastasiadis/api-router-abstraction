import * as t from "io-ts"
import { controller } from "../../src/design/controller"

describe("Controller Helper", () => {
    it("should return a valid parser for a controller", () => {
        const cr = {
            getPostsById: {
                args: t.type({}),
            },
        }
        const br = {}
        const parser = controller.withConfig(cr, br)
        const result = parser.f("getPostsById")

        expect(result).toEqual({
            _consumed: [{ _tag: "Controller", label: "getPostsById" }],
            _pending: {},
        })
    })
})
