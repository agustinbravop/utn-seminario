import { Button, ButtonProps } from "@chakra-ui/react";

export interface SubmitButtonProps extends ButtonProps {}

/**
 * Personaliza un Chakra `Button` para que sea el botón primario. El `<button />` renderizado tiene type 'submit' por defecto.
 *
 * https://chakra-ui.com/docs/components/button
 */
export default function SubmitButton(props: SubmitButtonProps) {
  const { children, ...rest } = props;

  return (
    <Button type="submit" colorScheme="brand" {...rest}>
      {children}
    </Button>
  );
}
