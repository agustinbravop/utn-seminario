import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { ApiError } from "../utils/api";

/**
 * Es similar a `UseMutationOptions` de '@tanstack/react-query', pero en TError
 * usa por defecto a `ApiError`.
 */
export interface UseApiMutationOptions<
  /** TVariables es el tipo del objeto que se pasa por parámetro a `mutate()`. */
  TVariables = void,
  /** TData es el tipo de lo que el servidor devuelve si la mutación es exitosa. */
  TData = unknown,
  /** TError es `ApiError` por defecto porque es lo que nuestro backend devuelve. */
  TError = ApiError,
  TContext = unknown,
> extends UseMutationOptions<TData, TError, TVariables, TContext> {}

/**
 * Adapter del `useMutation` de '@tanstack/react-query', para nuestro backend.
 *
 * Por defecto, TError es `ApiError` dado que nuestro backend devuelve eso.
 * Este hook es solo una conveniencia para escribir menos generics de TypeScript.
 */
export function useApiMutation<
  TVariables = void,
  TData = unknown,
  TError = ApiError,
  TContext = unknown,
>(
  options: UseApiMutationOptions<TVariables, TData, TError, TContext> = {}
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation(options);
}
