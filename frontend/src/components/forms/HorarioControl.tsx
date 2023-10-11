import { HORAS, MINUTOS } from "@/utils/constants";
import { HStack, Select, Text } from "@chakra-ui/react";
import { BaseFormControl } from ".";
import { useController } from "react-hook-form";
import { SelectControlProps } from "./SelectControl";
import { useState } from "react";

interface HorarioControlProps extends SelectControlProps {
  /** Las horas a poder seleccionar. Por defecto la constante HORAS. */
  horas?: string[];
  /** Los minutos a poder seleccionar. Por defecto la constante MINUTOS. */
  minutos?: string[];
}

/**
 * Personaliza dos `SelectControl` para seleccionar un horario de manera parametrizada.
 * Un horario elegible es una hora de la constante `HORAS` y un minuto de la constante `MINUTOS`.
 * El horario elegido se representa en formato `hh:mm`, con las horas entre 1 y 23.
 */
export default function HorarioControl(props: HorarioControlProps) {
  const { name, control, horas = HORAS, minutos = MINUTOS, ...rest } = props;
  const {
    field: { onChange, value, ...restField },
  } = useController({ name, control });
  const [hora, setHora] = useState(value?.split(":")[0] ?? "hh");
  const [minuto, setMinuto] = useState(value?.split(":")[1] ?? "mm");
  const handleHoraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHora(e.target.value);
    onChange(`${e.target.value}:${minuto}`);
  };

  const handleMinutoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMinuto(e.target.value);
    onChange(`${hora}:${e.target.value}`);
  };

  return (
    <BaseFormControl control={control} {...rest} {...restField}>
      <HStack>
        <Select
          maxW="max-content"
          name={`${name}.hora`}
          onChange={handleHoraChange}
          value={hora}
        >
          {horas.map((hora, i) => (
            <option key={i} value={hora}>
              {hora}
            </option>
          ))}
          <option key={"hh"} value="hh">
            hh
          </option>
        </Select>
        <Text>:</Text>
        <Select
          maxW="max-content"
          name={`${name}.minuto`}
          onChange={handleMinutoChange}
          value={minuto}
        >
          {minutos.map((minuto, i) => (
            <option key={i} value={minuto}>
              {minuto}
            </option>
          ))}
          <option key={"mm"} value="mm">
            mm
          </option>
        </Select>
        <Text>hs</Text>
      </HStack>
    </BaseFormControl>
  );
}
