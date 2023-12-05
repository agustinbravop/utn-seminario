import { Button, ButtonProps } from "@chakra-ui/react";
import { Ref, forwardRef } from "react";

export interface SubmitButtonProps extends ButtonProps {}

/**
 * Personaliza un Chakra `Button` para que sea el botón primario. El `<button />` renderizado tiene type 'submit' por defecto.
 *
 * https://chakra-ui.com/docs/components/button
 */
const SubmitButton = forwardRef(function SubmitButton(
  props: SubmitButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  const { children, ...rest } = props;

  return (
    <Button type="submit" ref={ref} colorScheme="brand" {...rest}>
      {children}
    </Button>
  );
});

export default SubmitButton;
