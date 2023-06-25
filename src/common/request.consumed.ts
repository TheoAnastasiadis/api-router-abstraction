import { Either } from "./either.types"

export type RequestT = {
    path: string
    method?: string
    headers?: Map<string, string>
    cookies?: Map<string, string>
    body?: object
}

export enum ParsingErrors {
    BODY_ERROR = "BODY_ERROR",
    PATH_ERROR = "PATH_ERROR",
    QUERY_ERROR = "QUERY_ERROR",
    METHOD_ERROR = "METHOD_ERROR",
    AUTH_ERROR = "AUTH_ERROR",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export type ConsumedRequest<T> = (
    | {
          consumed: T
          healthy: true
          controller?: string
      }
    | {
          consumed: T
          healthy: false
          error: ParsingErrors
      }
) &
    RequestT
