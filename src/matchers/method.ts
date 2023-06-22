import { RequestT } from "../common/request"

/**
 * Method types. This will have to be mached to HTTP method names.
 *
 * Examples: GET, POST, etc.
 *
 */
export type MethodT =
    | "GET"
    | "POST"
    | "DELETE"
    | "PUT"
    | "GET,POST"
    | "GET,DELETE"
    | "GET,POST"
    | "GET,PUT"
    | "GET,DELETE"
    | "POST,PUT"
    | "POST,DELETE"
    | "PUT,DELETE"
    | "GET,POST,PUT"
    | "GET,POST,DELETE"
    | "GET PUT,DELETE"
    | "POST,PUT,DELETE"
    | "GET,POST,PUT,DELETE"
