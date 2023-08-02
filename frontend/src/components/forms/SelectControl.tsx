import { Select, SelectProps } from "@chakra-ui/react";
import { useController } from "react-hook-form";
import {
  BaseFormControl,
  NoVariantBaseFormControlProps,
} from "./BaseFormControl";

interface SelectControlProps
  extends NoVariantBaseFormControlProps,
    Omit<SelectProps, keyof NoVariantBaseFormControlProps> {}

/**
 * Envuelve un Chakra `Select` dentro de un `FormControl` integrado a react-hook-form. Espera la lista de `option`s como children.
 *
 * https://chakra-ui.com/docs/components/select
 */
export function SelectControl(props: SelectControlProps) {
  const { name, control, icon, variant, children, ...rest } = props;
  const { field } = useController({
    name,
    control,
  });

  return (
    <BaseFormControl name={name} control={control} {...rest}>
      <Select {...field} id={name} icon={icon} variant={variant}>
        {children}
      </Select>
    </BaseFormControl>
  );
}
