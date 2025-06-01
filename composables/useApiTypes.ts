import type { InternalApi } from 'nitropack'

export type ApiRoutes = keyof InternalApi
export type ApiResponse<T extends ApiRoutes, M extends keyof InternalApi[T]> = InternalApi[T][M]

export const useApiRef = <T extends ApiRoutes, M extends keyof InternalApi[T], D>(opts: {
  route: T
  method: M
  defaultValue: D
}) => ref<ApiResponse<T, M> | D>(opts.defaultValue) 