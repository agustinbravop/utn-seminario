import {
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { ApiError, get } from "../utils/api";

export interface UseApiQueryOptions<
  TQueryFnData = unknown,
  /** TData es el tipo del resultado de la query si es exitosa. */
  TData = TQueryFnData,
  /** TError es `ApiError` por defecto porque es lo que nuestro backend devuelve ante un error. */
  TError = ApiError,
  TQueryKey extends QueryKey = QueryKey,
> extends UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> {}

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
  options: UseApiQueryOptions<TQueryFnData, TData, TError, TQueryKey>,
  endpoint?: string
): UseQueryResult<TData, TError> {
  if (endpoint) {
    options.queryFn = () => get(endpoint);
  }
  return useQuery(options);
}
