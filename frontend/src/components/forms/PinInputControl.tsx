import {
  PinInput,
  PinInputField,
  PinInputProps,
  Stack,
  StackProps,
} from "@chakra-ui/react";
import { useController } from "react-hook-form";
import BaseFormControl, {
  NoVariantBaseFormControlProps,
} from "./BaseFormControl";

interface PinInputControlProps
  extends NoVariantBaseFormControlProps,
    Omit<PinInputProps, keyof NoVariantBaseFormControlProps> {
  /**
   * Chakra StackProps. Van al `Stack` que contiene la lista de `PinInputField` renderizados.
   */
  stackProps?: StackProps;

  /**
   * Cantidad de componentes Chakra `PinInputField` a renderizar.
   */
  pinAmount: number;
}

/**
 * Envuelve un Chakra `PinInput` dentro de un `Stack` dentro de un `FormControl` integrado a react-hook-form. Al PinInput se le asignan las propiedades 'name', 'variant', 'type', 'placeholder', 'otp', 'mask' y 'onComplete'. No recibe children.
 *
 * https://chakra-ui.com/docs/components/pin-input
 */
export default function PinInputControl(props: PinInputControlProps) {
  const {
    name,
    control,
    pinAmount,
    type,
    placeholder,
    mask,
    otp,
    stackProps,
    variant,
    onComplete,
    ...rest
  } = props;
  const {
    field: { ref, ...restField },
  } = useController({
    name,
    control,
  });

  const renderedPinInputFields = Array(pinAmount)
    .fill(null)
    .map((_, i) => <PinInputField key={i} />);

  return (
    <BaseFormControl name={name} control={control} {...rest}>
      <Stack direction="row" {...stackProps}>
        <PinInput
          type={type}
          placeholder={placeholder}
          otp={otp}
          mask={mask}
          variant={variant}
          onComplete={onComplete}
          {...restField}
        >
          {renderedPinInputFields}
        </PinInput>
      </Stack>
    </BaseFormControl>
  );
}
