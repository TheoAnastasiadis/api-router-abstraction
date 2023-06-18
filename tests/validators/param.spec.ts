import { RequestT } from '../../src/parser/request'
import {ParamT, ParamValidator} from '../../src/validators/param'

describe("URL Param validator", () => {
    it("should narrow ParamT validators", () => {
        expect(ParamValidator.is("/:id(number)")).toBe(true)
        expect(ParamValidator.is("/posts")).toBe(true)
        expect(ParamValidator.is("?desc=true")).toBe(false)
    })

    it("should consume good requests", () => {
        const request : RequestT = {path: "/posts/2?desc=true"}
        const Validator1: ParamT = "/posts"
        const Validator2: ParamT = "/:id(number)"
        const consumed1 = ParamValidator.consume(request, Validator1)
        const consumed2 = ParamValidator.consume(consumed1, Validator2)

        expect(consumed1).toEqual({path: '/2?desc=true', consumed: {}, healthy: true})
        expect(consumed2).toEqual({path: '?desc=true', consumed: {id: 2}, healthy: true})
    })
})