import { Flex, Switch, SwitchProps } from "@chakra-ui/react";
import { useController } from "react-hook-form";
import { BaseFormControl, BaseFormControlProps } from "./BaseFormControl";

export interface SwitchControlProps
  extends BaseFormControlProps,
    Omit<SwitchProps, keyof BaseFormControlProps> {}

/**
 * Renderiza un Chakra `Switch` dentro de un `FormControl` integrado a react-hook-form.
 *
 * https://chakra-ui.com/docs/components/switch
 */
export default function SwitchControl(props: SwitchControlProps) {
  const { name, control, label, ...rest } = props;

  const { field } = useController({
    name,
    control,
  });

  return (
    <BaseFormControl
      as={Flex}
      name={name}
      control={control}
      label={label}
      {...rest}
    >
      <Switch isChecked={field.value} {...field} />
    </BaseFormControl>
  );
}
