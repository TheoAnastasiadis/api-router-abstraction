import { ParsingErrors, RequestT } from "../../src/common/request.consumed"
import { ConsumedResponse } from "../../src/common/response.consumed"
import { BodyT, bodyRegistry } from "../../src/matchers/body"
import { BodyValidator } from "../../src/validators/body.validator"
import * as t from "io-ts"

describe("BodyValidator", () => {
    const bodyRegistry: bodyRegistry = {
        post: t.type({
            id: t.number,
            author: t.string,
            body: t.string,
            private: t.boolean,
        }),
    }

    it("should narrow validators", () => {
        expect(BodyValidator.is("post_body", bodyRegistry)).toBeTruthy()
        expect(BodyValidator.is("user_body", bodyRegistry)).toBeFalsy()
    })

    it("should match good requests", () => {
        const body = {
            id: 3,
            author: "John Doe",
            body: "Lorem ipsum...",
            private: false,
        }
        const request: RequestT = { path: "/posts", method: "PUT", body }
        const validation = BodyValidator.consume(
            request,
            "post_body",
            bodyRegistry
        )
        expect(validation).toEqual({
            ...request,
            consumed: { body },
            healthy: true,
        })
    })

    it("should not match bad requests", () => {
        const body = {
            userName: "johnDoe",
            age: "99",
            email: "john@doe.com",
        }
        const request: RequestT = { path: "/posts", method: "PUT", body }
        const validation = BodyValidator.consume(
            request,
            "post_body",
            bodyRegistry
        )
        expect(validation).toEqual({
            ...request,
            consumed: { body: {} },
            healthy: false,
            error: ParsingErrors.BODY_ERROR,
        })
    })

    it("should generate from data", () => {
        const response: ConsumedResponse = {
            path: "",
        }

        const body = {
            userName: "johnDoe",
            age: "99",
            email: "john@doe.com",
        } as const

        const result = BodyValidator.format({ body }, "post_body", response)

        expect(result).toEqual({
            path: "",
            body: {
                userName: "johnDoe",
                age: "99",
                email: "john@doe.com",
            },
        })
    })
})
