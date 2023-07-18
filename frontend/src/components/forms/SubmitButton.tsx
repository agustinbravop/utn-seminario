import { Button, ButtonProps } from "@chakra-ui/react";
import { Control } from "react-hook-form";
import { useFormState } from "react-hook-form";

export interface SubmitButtonProps extends ButtonProps {
  /**
   * El control de react-hook-form pasado por FormProvider.
   * Solo se requiere si no se usa FormProvider.
   */
  control?: Control<any, any>;
}

/**
 * Integra un Chakra `Button` con react-hook-form para gestionar los estados Loading, Submitting, etc.
 * El button renderizado **submitea el form al ser seleccionado** y tiene type 'submit' por defecto.
 *
 * https://chakra-ui.com/docs/components/button
 */
export default function SubmitButton(props: SubmitButtonProps) {
  const { control, children, ...rest } = props;
  const { isSubmitting } = useFormState({
    control,
  });

  return (
    <Button type="submit" isLoading={isSubmitting} {...rest}>
      {children}
    </Button>
  );
}
