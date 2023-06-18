/**
 * Method types. This will have to be mached to HTTP method names.
 *
 * Examples: GET, POST, etc.
 *
 */
export type MethodT = Method

type Method = "GET" | "POST" | "DELETE" | "PUT"

type AggregateMethod = `${Method}` //TODO

export type returnObject = {}
