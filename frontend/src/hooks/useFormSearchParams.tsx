import { useEffect } from "react";
import { FieldValues, SetFieldValue, UseFormWatch } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

export interface FormSearchParamsConfig<TFieldValues extends FieldValues> {
  watch: UseFormWatch<TFieldValues>;
  setValue: SetFieldValue<any>;
  exclude?: string[];
}

/**
 * Persiste los valores de un form de `react-hook-form` como parámetros en la URL de la app.
 * Útil cuando un usuario quiere compartir una página y que los valores de los filtros se mantengan.
 * Cuidado: utiliza la URL completa, no solo los parámetros que son de names de inputs del form.
 * Ref: inspirado en https://github.com/tiaanduplessis/react-hook-form-persist/blob/master/src/index.tsx
 */
export function useFormSearchParams<TFieldValues extends FieldValues>({
  watch,
  setValue,
  exclude = [],
}: FormSearchParamsConfig<TFieldValues>) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Actualiza los parámetros de la URL siempre que cambian los valores del form.
  useEffect(() => {
    const subscription = watch((watchedValues) => {
      // Filtrar valores del form excluidos.
      const values: { [key: string]: any } = exclude.length
        ? Object.entries(watchedValues)
            .filter(([key]) => !exclude.includes(key))
            .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {})
        : Object.assign({}, watchedValues);

      Object.keys(values).forEach(
        (key) => values[key] === undefined && delete values[key]
      );

      setSearchParams(values);
    });
    return () => subscription.unsubscribe();
  }, [watch, setSearchParams, exclude]);

  // Actualiza los valores del form al cargar la URL.
  useEffect(() => {
    searchParams.forEach((value, key) => {
      // Se omiten los valores excluidos.
      if (!exclude.includes(key)) {
        setValue(key, value);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, searchParams]); // Agregar `exclude` provoca un bucle infinito.

  return {
    clear: () =>
      searchParams.forEach((_, key) => {
        searchParams.delete(key);
      }),
  };
}
