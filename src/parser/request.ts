export type RequestT = {
    path: string,
    method?: string,
    headers?: Map<string, string>
    cookies?: Map<string, string>
}

export type ConsumedRequest<T> = {
    consumed: T,
    healthy: boolean
} & RequestT