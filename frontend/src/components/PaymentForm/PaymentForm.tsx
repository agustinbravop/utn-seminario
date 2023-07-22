import Cards, { Focused } from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { useState } from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";
import InputControl from "../forms/InputControl";
import { Control, useWatch } from "react-hook-form";

interface PaymentFormProps {
  control?: Control<any, any>;
}

/*
 Tanto react-hook-form como react-credit-cards usan el 'name' del input. Priorizamos
 respetar el 'name' que react-hook-form necesita, asi que este diccionario 
 traduce el 'name' del input al valor que el tipo `Focused` de react-credit-cards espera. 
*/
const map: Record<string, Focused> = {
  "tarjeta.numero": "number",
  "tarjeta.nombre": "name",
  "tarjeta.vencimiento": "expiry",
  "tarjeta.cvv": "cvc",
};

export default function PaymentForm({ control }: PaymentFormProps) {
  const [focused, setFocused] = useState<Focused | undefined>(undefined);
  const values = useWatch({ name: "tarjeta", control });

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(map[e.target.name]);
  };

  return (
    <HStack spacing="4" justifyContent="center" my="20px">
      <VStack spacing="4" minWidth="150px" maxWidth="300px">
        <InputControl
          name="tarjeta.numero"
          label="Numero de tarjeta"
          placeholder=" "
          onFocus={handleInputFocus}
          isRequired
        />
        <InputControl
          name="tarjeta.nombre"
          label="Nombre del dueño"
          placeholder="Nombre"
          onFocus={handleInputFocus}
          isRequired
        />

        <HStack spacing="20px">
          <InputControl
            placeholder="00/00"
            name="tarjeta.vencimiento"
            label="Vencimiento"
            onFocus={handleInputFocus}
            isRequired
          />
          <InputControl
            placeholder="000"
            name="tarjeta.cvv"
            label="CVV"
            type="number"
            onFocus={handleInputFocus}
            isRequired
          />
        </HStack>
      </VStack>

      <Box m="0">
        <Cards
          cvc={values.cvv}
          expiry={values.vencimiento}
          name={values.nombre}
          number={values.numero}
          focused={focused}
        />
      </Box>
    </HStack>
  );
}
