import { CheckboxGroupProps, CheckboxGroup } from "@chakra-ui/react";
import { useController, useFieldArray } from "react-hook-form";
import { BaseFormControl, BaseFormControlProps } from "./BaseFormControl";

export interface CheckboxGroupControlProps
  extends BaseFormControlProps,
    Omit<CheckboxGroupProps, keyof BaseFormControlProps> {}

/**
 * Envuelve un Chakra `CheckboxGroup` dentro de un `FormControl` integrado a react-hook-form, para construir grupos de `Checkbox`s que recibe como children.
 * Si se quiere un checkbox individual, es preferible usar `CheckboxSingleControl`.
 *
 * https://chakra-ui.com/docs/components/checkbox#checkboxgroup
 */
export default function CheckboxGroupControl(props: CheckboxGroupControlProps) {
  const { name, control, children, ...rest } = props;
  const {
    field: { ref, onChange, ...restField },
  } = useController({
    control,
    name,
  });

  // useFieldArray permite que react-hook-form valide el array de valores (los checkboxs tildados).
  const { replace } = useFieldArray({
    name,
    control,
  });

  // Además de llamar field.onChange(), también debe actualizar el fieldArray.
  const handleChange = (values: string[]) => {
    replace(values);
    onChange(values);
  };

  return (
    <BaseFormControl name={name} control={control} {...rest}>
      <CheckboxGroup {...restField} onChange={handleChange}>
        {children}
      </CheckboxGroup>
    </BaseFormControl>
  );
}
