import { FormLabel, Select, SelectProps } from "@chakra-ui/react";
import { useController } from "react-hook-form";
import BaseFormControl, {
  NoVariantBaseFormControlProps,
} from "./BaseFormControl";

export interface SelectControlProps
  extends NoVariantBaseFormControlProps,
    Omit<SelectProps, keyof NoVariantBaseFormControlProps> {}

/**
 * Envuelve un Chakra `Select` dentro de un `FormControl` integrado a react-hook-form. Espera la lista de `option`s como children.
 *
 * https://chakra-ui.com/docs/components/select
 */
export default function SelectControl(props: SelectControlProps) {
  const {
    name,
    control,
    icon,
    placeholder,
    variant = "floating",
    label,
    children,
    ...rest
  } = props;
  const { field } = useController({ name, control });

  return (
    <BaseFormControl name={name} control={control} variant={variant} {...rest}>
      <Select {...field} id={name} placeholder={placeholder} icon={icon}>
        {children}
      </Select>
      {label && typeof label === "string" ? (
        <FormLabel htmlFor={name}>{label}</FormLabel>
      ) : (
        label
      )}
    </BaseFormControl>
  );
}
