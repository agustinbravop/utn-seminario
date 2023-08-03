import { RadioGroup, type RadioGroupProps } from "@chakra-ui/react";
import { useController } from "react-hook-form";
import { BaseFormControl, type BaseFormControlProps } from "./BaseFormControl";

interface RadioGroupControlProps
  extends BaseFormControlProps,
    Omit<RadioGroupProps, keyof BaseFormControlProps> {}

/**
 * Envuelve un Chakra `RadioGroup` dentro de un `FormControl` integrado a react-hook-form. Espera la lista de `Radio`s como children.
 *
 * https://chakra-ui.com/docs/components/radio
 */
export function RadioGroupControl(props: RadioGroupControlProps) {
  const { name, control, children, ...rest } = props;
  const { field } = useController({
    name,
    control,
  });

  return (
    <BaseFormControl name={name} control={control} {...rest}>
      <RadioGroup {...field}>{children}</RadioGroup>
    </BaseFormControl>
  );
}
