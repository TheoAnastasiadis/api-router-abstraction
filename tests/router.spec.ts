import * as t from "io-ts"
import RouterGenerator from "../src/router"

describe("Router", () => {
    const generator = RouterGenerator.withConfig({
        controllerRegistry: {
            getPostsByDate: {
                args: t.type({
                    from: t.string,
                    to: t.string,
                }),
            },
            getPostById: {
                args: t.type({
                    id: t.number,
                }),
            },
            createPost: {
                args: t.type({}),
                body: "post",
            },
        },
        bodyRegistry: {
            post: {
                fields: t.type({
                    author: t.string,
                    date: t.string,
                    private: t.boolean,
                    content: t.string,
                }),
            },
        },
    })

    test("can create new empty router from config", () => {
        expect(generator).toHaveProperty("design")
        expect(generator).toHaveProperty("format")
        expect(generator).toHaveProperty("parse")
        expect(generator).toHaveProperty("fromSchema")
    })
    test("returns the expected design objects", () => {
        expect(generator.design()).toHaveProperty("controller")
        expect(generator.design()).toHaveProperty("f")
        expect(generator.design()).toHaveProperty("chain")
        expect(generator.design()).toHaveProperty("c")
        expect(generator.design()).toHaveProperty("alt")
        expect(generator.design()).toHaveProperty("a")
    })

    test("can create generator from schema", () => {
        const router = generator.fromSchema({
            _consumed: [],
            _pending: {},
        })
        expect(router).toHaveProperty("format")
        expect(router).toHaveProperty("parse")
    })

    test("can parse urls", () => {
        const router = generator.fromSchema({
            _consumed: [],
            _pending: {},
        })
        expect(router.parse({ path: "/posts" })).toHaveProperty("_tag", "Left")
    })

    test("can format requests", () => {
        const router = generator.fromSchema({
            _consumed: [],
            _pending: {},
        })
        expect(
            router.format("createPost", {
                body: {
                    author: "John Doe",
                    date: "1/1/2020",
                    private: false,
                    content: "Lorem Ipsum",
                },
            })
        ).toHaveProperty("path", "")
    })
})
