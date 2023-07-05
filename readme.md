# Api Router Abstraction

<div align="center">

![coverage](https://img.shields.io/badge/100%25-green?label=test%20coverage)
![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)
![version](https://img.shields.io/badge/1.0.0-blue?label=version)

</div>

Typescript library to help abstract router details from controller implementations. Typesafe way to combine controllers with API URLs.

![Imgur](https://i.imgur.com/hYp2qlr.png)

# Usage

## Install

```bash
pip install api-router-abstraction
```

## Define controllers

```typescript
//set the arguments and (optional) return types for your controllers
controllerRegistry: {
    getPostById: {
        args: t.type({ //arguments are represented using io-ts types
            id: t.number,
        }),
    },
    getPostsByDate: {
        args: t.type({
            date: t.union([t.string, t.undefined]),
        }),
        returnType: t.type(...) //optional
    },
    createPost: {
        args: t.type({
            draft: t.boolean,
        }),
        body: "post", //this can be any key from the body registry
    },
},

//body registry can help define large groups of arguments that won't appear in the URL path
bodyRegistry: {
    post: {
        fields: t.type({
            author: t.string,
            content: t.string,
        }),
    },
}
```

## Design your api interface structure

```typescript
import { RouterGenerator } from "api-router-abstraction"

const generator = RouterGenerator.withConfig({
    controllerRegistry,
    bodyRegistry,
})

const { c, a, f } = generator.design()
```

### Chain

Function `c` or `chain` will arrange validators in sequence. For example

```typescript
c({ GET: c({ "/search": c({ "?q=string": f("search") }) }) })
```

will require that the request matches all 3 sequentially (ex. `GET /search?q=cars`).

### Alt

Function `a` or `alt` will arrange validators in parallel. For example

```typescript
c({
    POST: a(
        { "/posts": f("createPost") },
        { "/users": f("createUser") },
        { "/comments": f("createComment") }
    ),
})
```

will require that the request matches any of the arguments of `a` (ex. `POST /users`).

### Controller

Function `controller` or `f` takes a key of `controllerRegistry` as argument. It used to type-check your interface design and format url paths (see example bellow).

## Compile

In order for your code to compile your all controller nodes must be able to be supplied with all their arguments (as assigned in the `controllerRegistry` object).

```typescript
const generator = RouterGenerator.withConfig({
    likePost: {
        args: t.type({ postId: t.number }),
    },
})

const router = generator.fromSchema(
    c("/posts": c("/:postId(number)": f("likePost"))) //this compiles
)

//these don't!
const router = generator.fromSchema(
    c("/posts": f("likePost"))
    //too few arguments
)

const router = generator.fromSchema(
    c("?isLogedIn=boolean":
        c("/:postId(number)": f("likePost"))
    ) //too many arguments
)
```

## Use

The `router` object comes with format and parse methods out of the box.

```typescript
const router = generator.fromSchema(schema) //see image example above

router.parse({ path: "post/3", method: "GET" })
// controller: "getPostsById", consumed: {id: 3}}

router.format("createPost", {
    draft: false,
    body: { author: "John Doe", content: "Lorem ipsum..." },
})
// {path: "/posts?draft=false", method: "POST", body: {...}}
```

# Available Validators

| type       | format examples                                                                              | notes                                                                                                                                                                                                                                                                                                                                               |
| ---------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Method     | `"GET"`, `"POST"`, `"PUT"`, `"DELETE"` and even combinations like `"GET, POST"` etc.         | These will match with the request method. If a method is not provided to the `router.parse` function, these validators will be ignored.                                                                                                                                                                                                             |
| Path Param | `"/pathName"` or `"/:paramName(string)"`, `"/:paramName(number)"`, `"/:paramName(boolean)"`. | They will match with the path URL string. The `router.parse` function will return a consumed object containing param names and values. For `"/:paramName(number)"` and `"/:paramName(boolean)"` if the provided path cannot be parsed according to the specified type, the validation won't resolve. `"/:paramName(string)"` will match everything. |
| Query      | `"?name=string"`, `"?name1=number&name2=boolean"`, `"name1=string&name2=number!"`, etc...    | They will match to the query part of the request url. If a `!` is provided after the query param type, the matching won't resolve without if the param is not present.                                                                                                                                                                              |
| body       | `"post_body"`, `"user_body"`, etc...                                                         | They will use io-ts parsers of the corresponding `bodyRegistry` key in order to validate the request body payload.                                                                                                                                                                                                                                  |

# Controller Implementations

You can enforce controller implementation types by providing the router as an argument of the `ControllerImplementations` type.

```typescript
import { ControllerImplementations } from "api-router-abstractions"

const controllerImpls: ControllerImplementations<typeof router> = {
    getPostById: function (
        args: { id: number },
        router? //the router object
        ...rest: any
    ): unknown {...},
    //if no returnType arg is provided in the controllerRegistry
    getPostsByDate: function (
        args: { date: string | undefined },
        router?
        ...rest: any
    ): *ReturnType* {...},
    //from the controllerRegistry
   ...
}
```

# Limitations

-   Authentication is not handled in this library. User object should be provided in the rest parameters of controller functions.

-   Safety: this library should not be used in production without extensive security testing.

-   Unexpected behaviour: thorough testing on all possible url configurations, charsets and lengths has not been carried out.

-   Addapters for server libraries (like express.js) will have to be written manually.

## Contribute 💓💗

If you like the pronciples behind this project and would like to cooperate contact me or open a PR!

# Check out more

[io-ts](https://github.com/gcanti/io-ts) Runtime type system for IO decoding/encoding

[Pissflix](https://github.com/TheoAnastasiadis/pissflix) Civilized smartTV content platform for 2023
