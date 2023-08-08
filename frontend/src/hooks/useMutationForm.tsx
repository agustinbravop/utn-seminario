import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { UseFormProps, FieldValues, DefaultValues } from "react-hook-form";
import { ObjectSchema } from "yup";

/**
 * Props de `useMutationForm`. Es la junta de los props de `useForm` y `useMutation`.
 * Se le agrega un atributo 'validationSchema' para validaciones con Yup.
 */
export interface MutationFormProps<
  TData,
  TError,
  TVariables extends FieldValues,
  TContext,
> extends UseFormProps<TVariables>,
    Omit<UseMutationOptions<TData, TError, TVariables, TContext>, "context"> {
  /**
   * Schema de Yup a usar para validar los inputs. Consumido por `yupResolver`.
   */
  validationSchema?: ObjectSchema<any>;

  /**
   * Idéntico a `defaultValues` de `useForm`, pero cada vez que el valor cambie
   * se ejecuta `method.reset(defaultValues)` para actualizar el form.
   * Permite, por ejemplo, hacer un fetch asincrónico de los defaultValues, y
   * actualizar el form cuando se los obtenga.
   */
  defaultValues?: DefaultValues<TVariables>;
}

/**
 * Binding entre `useMutation` de tanstack y `useForm` de react-hook-form.
 * Solo conviene usar para formularios que provocan una mutación al enviarse.
 *
 * Esencialmente, llama a `mutate` dentro de `handleSubmit`, y hace
 * un `methods.reset(defaultValues)` siempre que los defaultValues cambien.
 */
export default function useMutationForm<
  TData = unknown,
  TError = unknown,
  TVariables extends FieldValues = {},
  TContext = unknown,
>({
  validationSchema,
  ...props
}: MutationFormProps<TData, TError, TVariables, TContext>) {
  const {
    mode,
    reValidateMode,
    defaultValues,
    values,
    resetOptions,
    criteriaMode,
    shouldFocusError,
    delayError,
    shouldUseNativeValidation,
    shouldUnregister,
  } = props; // Props de `useForm`

  const methods = useForm<TVariables>({
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    defaultValues: defaultValues ?? validationSchema?.getDefault(),
    mode: mode ?? "onTouched",
    reValidateMode,
    values,
    resetOptions,
    criteriaMode,
    shouldFocusError,
    delayError,
    shouldUseNativeValidation,
    shouldUnregister,
  });

  useEffect(() => {
    // Recargar el formulario con los datos actualizados. Se ejecuta al montarse,
    // y otra vez si los defaultValues se cargan asincrónicamente.
    methods.reset(defaultValues);
  }, [methods, defaultValues]);

  const {
    mutationFn,
    cacheTime,
    mutationKey,
    networkMode,
    onError,
    onMutate,
    onSettled,
    onSuccess,
    retry,
    retryDelay,
    useErrorBoundary,
    meta,
  } = props; // Props de `useMutation`

  const mutationResult = useMutation<TData, TError, TVariables, TContext>({
    mutationFn,
    cacheTime,
    mutationKey,
    networkMode,
    onError,
    onMutate,
    onSettled,
    onSuccess,
    retry,
    retryDelay,
    useErrorBoundary,
    meta,
  });

  return { ...mutationResult, methods };
}
