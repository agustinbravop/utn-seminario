import { InputRightElement, Button } from "@chakra-ui/react";
import { useState } from "react";
import InputControl, { InputControlProps } from "./InputControl";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

/**
 * Personaliza un `InputControl` para que permita mostrar y ocultar la contraseña.
 */
export default function PasswordControl(props: InputControlProps) {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputControl
      rightElement={
        <InputRightElement w="4.5rem">
          <Button
            h="1.8rem"
            p="0"
            size="lg"
            title={show ? "Mostrar contraseña" : "Ocultar contraseña"}
            onClick={handleClick}
          >
            {show ? <ViewOffIcon /> : <ViewIcon />}
          </Button>
        </InputRightElement>
      }
      type={show ? "text" : "password"}
      {...props}
    />
  );
}
