import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
  InputGroup,
  FormLabel,
} from "@chakra-ui/react";
import { useController } from "react-hook-form";
import BaseFormControl, {
  NoVariantBaseFormControlProps,
} from "./BaseFormControl";

interface NumberInputControlProps
  extends NoVariantBaseFormControlProps,
    Omit<NumberInputProps, keyof NoVariantBaseFormControlProps> {
  /**
   * Si se debería o no renderizar el Chakra `NumberInputStepper`.
   * @default true
   */
  showStepper?: boolean;
}

/**
 * Envuelve un Chakra `InputGroup` dentro de un `FormControl` integrado a react-hook-form, para construir un `NumberInput` con las props 'name', 'variant', 'max', 'min' y 'step'. Si tiene children, los renderiza dentro del NumberInput.
 *
 * https://chakra-ui.com/docs/components/number-input
 */
export default function NumberInputControl(props: NumberInputControlProps) {
  const {
    name,
    control,
    label,
    showStepper = true,
    variant,
    max,
    min,
    step,
    precision,
    children,
    width,
    ...rest
  } = props;

  const {
    field: { ref, ...restField },
  } = useController({
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
        =
        <NumberInput
          id={name}
          variant={variant}
          max={max}
          min={min}
          step={step}
          precision={precision}
          width={width ?? "100%"}
          {...restField}
        >
          <NumberInputField name={name} ref={ref} />

          {label && typeof label === "string" ? (
            <FormLabel htmlFor={name}>{label}</FormLabel>
          ) : (
            label
          )}

          {showStepper && (
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          )}

          {children}
        </NumberInput>
        =
      </InputGroup>
    </BaseFormControl>
  );
}
