import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { DefaultValues, useForm, UseFormReturn } from "react-hook-form";
import { UseFormProps, FieldValues } from "react-hook-form";
import { ObjectSchema } from "yup";

/**
 * Props de `useYupForm()`.
 * Se le agrega un atributo 'validationSchema' para validaciones con Yup.
 * Se agrega 'resetValues' para resetear el form cada vez que el atributo cambie.
 */
export interface UseYupFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
> extends UseFormProps<TFieldValues, TContext> {
  /**
   * Schema de Yup a usar para validar los inputs. Consumido por `yupResolver`.
   */
  validationSchema?: ObjectSchema<any>;

  /**
   * Idéntico a `defaultValues` de `useForm`, pero cada vez que el valor cambie
   * se ejecuta `method.reset(resetValues)` para actualizar el form.
   * Permite, por ejemplo, hacer un fetch asincrónico de los defaultValues, y
   * actualizar el form cuando se los obtenga.
   */
  resetValues?: DefaultValues<TFieldValues>;
}

/**
 * Adapter de `useForm` (de 'react-hook-form') para validation schemas de Yup.
 */
export function useYupForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
>({
  validationSchema,
  resetValues,
  ...props
}: UseYupFormProps<TFieldValues, TContext>): UseFormReturn<
  TFieldValues,
  TContext,
  TTransformedValues
> {
  const { mode, defaultValues } = props;

  const methods = useForm<TFieldValues, TContext, TTransformedValues>({
    ...props,
    // Este hook envuelve el 'yupResolver', así no se expone al resto del código.
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    defaultValues: defaultValues ?? validationSchema?.getDefault(),
    mode: mode ?? "onTouched",
  });

  useEffect(() => {
    // Recargar el formulario con los datos actualizados. Se ejecuta al montarse,
    // y otra vez si los defaultValues se cargan asincrónicamente.
    if (resetValues) {
      methods.reset(resetValues);
    }
  }, [methods, resetValues]);

  return methods;
}
