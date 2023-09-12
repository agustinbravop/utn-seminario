import {
  Input,
  InputProps,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
  FormLabel,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { useController } from "react-hook-form";
import BaseFormControl, {
  NoVariantBaseFormControlProps,
} from "./BaseFormControl";

/**
 * A la interfaz BaseFormControlProps se le agregan las propiedades específicas del Chakra `Input`, además de los addons y elements (partes del `InputGroup`).
 * https://chakra-ui.com/docs/components/input
 */
export interface InputControlProps
  extends NoVariantBaseFormControlProps,
    Omit<InputProps, keyof NoVariantBaseFormControlProps> {
  /**
   * Chakra InputLeftAddon
   * https://chakra-ui.com/docs/components/input#left-and-right-addons
   */
  leftAddon?: ReactNode;

  /**
   * Chakra InputRightAddon
   * https://chakra-ui.com/docs/components/input#left-and-right-addons
   */
  rightAddon?: ReactNode;

  /**
   * Chakra InputLeftElement
   * https://chakra-ui.com/docs/components/input#add-elements-inside-input
   */
  leftElement?: ReactNode;

  /**
   * Chakra InputRightElement
   * https://chakra-ui.com/docs/components/input#add-elements-inside-input
   */
  rightElement?: ReactNode;
}

/**
 * Envuelve un Chakra `InputGroup` dentro de un `FormControl` integrado a react-hook-form, para construir un `Input` con las props 'name', 'id', 'type', 'placeholder' y 'variant'. Si tiene children, los renderiza en lugar de construir el Input (esto permite usar un input personalizado).
 *
 * https://chakra-ui.com/docs/components/input
 */
export default function InputControl(props: InputControlProps) {
  const {
    name,
    control,
    label,
    leftAddon,
    rightAddon,
    leftElement,
    rightElement,
    type,
    placeholder,
    variant,
    children,
    ...rest
  } = props;

  const { field } = useController({
    name,
    control,
  });

  return (
    <BaseFormControl
      name={name}
      control={control}
      variant="floating" // estilo por defecto
      {...rest}
    >
      <InputGroup>
        {typeof leftAddon === "string" ? (
          <InputLeftAddon>{leftAddon}</InputLeftAddon>
        ) : (
          leftAddon
        )}
        {typeof leftElement === "string" ? (
          <InputLeftElement>{leftElement}</InputLeftElement>
        ) : (
          leftElement
        )}

        {children ?? (
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder ?? " "} // Si es "" (string vacío) el floating label no flota
            variant={variant}
          />
        )}

        {label && typeof label === "string" ? (
          <FormLabel htmlFor={name}>{label}</FormLabel>
        ) : (
          label
        )}
        {typeof rightElement === "string" ? (
          <InputRightElement>{rightElement}</InputRightElement>
        ) : (
          rightElement
        )}
        {typeof rightAddon === "string" ? (
          <InputRightAddon>{rightAddon}</InputRightAddon>
        ) : (
          rightAddon
        )}
      </InputGroup>
    </BaseFormControl>
  );
}
