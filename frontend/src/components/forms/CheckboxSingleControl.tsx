import { Checkbox, CheckboxProps } from "@chakra-ui/react";
import { useController } from "react-hook-form";
import BaseFormControl, {
  NoVariantBaseFormControlProps,
} from "./BaseFormControl";

/**
 * Envuelve un Chakra `Checkbox` dentro de un `FormControl` integrado a react-hook-form, para construir un `Checkbox` individual con el 'name' pasado como prop.
 *
 * https://chakra-ui.com/docs/components/checkbox
 */
interface CheckboxSingleControlProps
  extends NoVariantBaseFormControlProps,
    Omit<CheckboxProps, keyof NoVariantBaseFormControlProps> {}

export default function CheckboxSingleControl(
  props: CheckboxSingleControlProps
) {
  const { name, control, children, icon, ...rest } = props;
  const { field } = useController({ name, control });

  return (
    <BaseFormControl name={name} control={control} {...rest}>
      <Checkbox id={name} isChecked={field.value} {...field}>
        {children}
      </Checkbox>
    </BaseFormControl>
  );
}
