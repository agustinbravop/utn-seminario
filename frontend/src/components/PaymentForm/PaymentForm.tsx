import Cards, { Focused } from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { useState } from "react";
import { Tarjeta } from "../../types";
import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";

interface PaymentFormProps {
  tarjeta: Tarjeta;
  setTarjeta: (t: Tarjeta) => void;
}
export default function PaymentForm({ tarjeta, setTarjeta }: PaymentFormProps) {
  const [focused, setFocused] = useState<Focused | undefined>(undefined);
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(e.target.name as unknown as Focused);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const t: Tarjeta = {
      nombre: name === "name" ? value : tarjeta.nombre,
      vencimiento: name === "expiry" ? value : tarjeta.vencimiento,
      cvv: name === "cvc" ? Number(value) : tarjeta.cvv,
      numero: name === "number" ? value : tarjeta.numero,
    };
    setTarjeta(t);
  };

  return (
    <HStack spacing="4" justifyContent="center">
      <VStack spacing="4" minWidth="150px" maxWidth="300px">
        <FormControl
          variant="floating"
          id="number"
          isRequired
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        >
          <Input placeholder="Contraseña" name="number" />
          <FormLabel>Numero de tarjeta</FormLabel>
        </FormControl>
        <FormControl
          variant="floating"
          id="name"
          isRequired
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        >
          <Input placeholder="Nombre" name="name" />
          <FormLabel>Nombre del dueño</FormLabel>
        </FormControl>

        <HStack spacing="20px">
          <FormControl
            variant="floating"
            id="expiry"
            isRequired
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          >
            <Input placeholder="00/00" name="expiry" />
            <FormLabel>Vencimiento</FormLabel>
          </FormControl>
          <FormControl
            variant="floating"
            id="cvc"
            isRequired
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          >
            <Input placeholder="000" name="cvc" />
            <FormLabel>CVV</FormLabel>
          </FormControl>
        </HStack>
      </VStack>
      <Cards
        cvc={tarjeta.cvv}
        expiry={tarjeta.vencimiento}
        focused={focused}
        name={tarjeta.nombre}
        number={tarjeta.numero}
      />
    </HStack>
  );
}
