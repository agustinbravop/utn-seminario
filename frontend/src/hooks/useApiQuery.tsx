import {
  DefinedUseQueryResult,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { ApiError, get } from "@/utils/api";

/**
 * Es similar a `UseQueryOptions` de '@tanstack/react-query', pero en TError
 * usa por defecto a `ApiError`.
 */
export interface UseApiQueryOptions<
  TQueryFnData = unknown,
  /** TError es `ApiError` por defecto porque es lo que nuestro backend devuelve ante un error. */
  TError = ApiError,
  /** TData es el tipo del resultado de la query si es exitosa. */
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> {}

/**
 * Overload para cuando en `options` se indica un atributo 'initialData'.
 */
export function useApiQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TError = ApiError,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  endpoint: string,
  options?: Omit<
    UseApiQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "initialData"
  > & { initialData: TQueryFnData | (() => TQueryFnData) }
): DefinedUseQueryResult<TData, TError>;

export function useApiQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TError = ApiError,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  endpoint: string,
  options?: UseApiQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError>;

/**
 * Adapter del `useQuery` de '@tanstack/react-query', para nuestro backend.
 *
 * Por defecto, TError es `ApiError` dado que nuestro backend devuelve eso.
 * Este hook es una conveniencia para escribir menos generics de TypeScript.
 *
 * @param endpoint (opcional) una URL a la cual hacerle un HTTP GET como `queryFn`.
 */
export function useApiQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TError = ApiError,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  endpoint: string,
  options: UseApiQueryOptions<TQueryFnData, TError, TData, TQueryKey> = {}
) {
  const queryFn = () => get<TQueryFnData>(endpoint);

  return useQuery<TQueryFnData, TError, TData, TQueryKey>(
    queryKey,
    queryFn,
    options
  );
}
