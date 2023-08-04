import {
  FormControl as ChakraFormControl,
  FormControlProps as ChakraFormControlProps,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { type Control, useController } from "react-hook-form";

/**
 * Propiedades del componente `BaseFormControl`. Extiende todas las propiedades del FormControl de Chakra excepto 'label' para que acepte un ReactNode en lugar de un simple string.
 */
export interface BaseFormControlProps
  extends Omit<ChakraFormControlProps, "label"> {
  /**
   * El nombre del input (obligatorio). react-hook-form lo utiliza para identificar al input y responder a sus cambios.
   */
  name: string;

  /**
   * El label a asociar con el input. Si es un string, se renderiza un Chakra `FormLabel` con ese string como contenido.
   */
  label?: ReactNode;

  /**
   * Es de react-hook-form, y FormProvider la pasa por defecto.
   * Solo es requerida si no se usa un FormProvider.
   */
  control?: Control<any, any>;

  /**
   * Texto de ayuda para mostrar debajo del input. Si es un string, se renderiza un Chakra `FormHelperText` con ese string como contenido.
   */
  helperText?: ReactNode;
}

/**
 * Tipo de conveniencia, igual a la interfaz `BaseFormControlProps` pero sin la propiedad 'variant'.
 *
 * Lo utilizan los componentes cuyos controles tienen propiedades 'variant' relevantes (ej: un `Input` o `Select`) para atajarla en lugar de dársela al `FormControl`.
 */
export type NoVariantBaseFormControlProps = Omit<
  BaseFormControlProps,
  "variant"
>;

/**
 * Integra a react-hook-form con ChakraUI para facilitar crear formularios.
 *
 * Envuelve a un control de input genérico (ej: `Input` o `Select`) con un `FormControl` de Chakra, acompañado con un `FormLabel` y un `FormHelperText`.
 * Si hay alguna validación definida en el useForm de react-hook-form fallando, se muestra su mensaje en un `FormErrorMessage`.
 *
 * Es una adaptación de https://github.com/crhistianramirez/react-hook-form-chakra
 */
export function BaseFormControl(props: BaseFormControlProps) {
  const { children, name, control, id, helperText, label, ...rest } = props;

  const {
    fieldState: { error, invalid },
    formState: { isSubmitting },
  } = useController({ name, control });
  return (
    <ChakraFormControl
      isInvalid={invalid}
      isDisabled={isSubmitting}
      id={id || name}
      {...rest}
    >
      {label && typeof label === "string" ? (
        <FormLabel htmlFor={name}>{label}</FormLabel>
      ) : (
        label
      )}

      {children}

      <FormErrorMessage>{error?.message}</FormErrorMessage>

      {helperText && typeof helperText === "string" ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : (
        helperText
      )}
    </ChakraFormControl>
  );
}
