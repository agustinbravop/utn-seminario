import { DisponibilidadForm } from "@/models";
import { Checkbox, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/react";
import {
  CheckboxGroupControl,
  InputControl,
  NumberInputControl,
  SelectControl,
  SubmitButton,
} from "@/components/forms";
import { DefaultValues, FormProvider } from "react-hook-form";
import { GrAddCircle } from "react-icons/gr";
import { useYupForm } from "@/hooks";
import * as Yup from "yup";
import { DIAS, DISCIPLINAS, DURACION_RESERVA, HORAS } from "@/utils/constants";
import { EditIcon } from "@chakra-ui/icons";
import HorarioControl from "@/components/forms/HorarioControl";

const validationSchema = Yup.object({
  id: Yup.number().integer().positive().optional(),
  horaInicio: Yup.string()
    .matches(/\d?\d:\d\d/, "Obligatorio")
    .required("Obligatorio"),
  horaFin: Yup.string()
    .matches(/\d?\d:\d\d/, "Obligatorio")
    .required("Obligatorio"),
  minutosReserva: Yup.number().positive().integer().required("Obligatorio"),
  disciplina: Yup.string().required("Obligatorio"),
  dias: Yup.array(Yup.string().oneOf(DIAS)).min(1, "Elija al menos un día"),
  precioReserva: Yup.number().integer().positive().required("Obligatorio"),
  precioSenia: Yup.number().integer().positive().optional(),
});

interface FormDispProps {
  onSubmit: (disp: DisponibilidadForm) => void;
  resetValues: DefaultValues<DisponibilidadForm>;
  variant: "crear" | "modificar";
}

export default function FormDisp({
  onSubmit,
  resetValues,
  variant,
}: FormDispProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const methods = useYupForm<DisponibilidadForm>({
    validationSchema,
    resetValues,
  });
  const horaInicio = methods.watch("horaInicio");

  const button =
    variant === "crear" ? (
      <Button my="0.5em" leftIcon={<Icon as={GrAddCircle} />} onClick={onOpen}>
        Agregar disponibilidad
      </Button>
    ) : (
      <Button size="sm" onClick={onOpen} title="modificar">
        <EditIcon />
      </Button>
    );

  return (
    <FormProvider {...methods}>
      {button}

      <Modal size="2xl" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={methods.handleSubmit((values) => {
            onSubmit(values);
            onClose();
          })}
        >
          <ModalHeader>
            {variant === "crear" ? "Agregar" : "Modificar"} disponibilidad
          </ModalHeader>
          <ModalBody>
            <HStack width="600px" py="10px">
              <HorarioControl
                placeholder="Elegir horario"
                label="Horario de Inicio"
                name="horaInicio"
                isRequired
              />
              <HorarioControl
                placeholder="Elegir horario"
                label="Horario de Fin"
                name="horaFin"
                isRequired
                horas={HORAS.filter(
                  (h) =>
                    horaInicio && Number(horaInicio.split(":")[0]) <= Number(h)
                )}
              />
            </HStack>
            <HStack width="600px" py="10px">
              <SelectControl
                placeholder="Seleccionar disciplina "
                name="disciplina"
                isRequired
              >
                {DISCIPLINAS.map((disciplina, i) => (
                  <option key={i} value={disciplina}>
                    {disciplina}
                  </option>
                ))}
              </SelectControl>
              {variant === "crear" ? (
                <SelectControl
                  placeholder="Seleccionar duración (min)"
                  name="minutosReserva"
                  isRequired
                >
                  {DURACION_RESERVA.map((duracion, i) => (
                    <option key={i} value={duracion}>
                      {duracion}
                    </option>
                  ))}
                </SelectControl>
              ) : (
                <NumberInputControl
                  placeholder="Seleccionar duración (min)"
                  name="minutosReserva"
                  label="Duración de la reserva (en minutos)"
                  isRequired
                  isReadOnly
                  isDisabled
                  width="100%"
                />
              )}
            </HStack>
            <HStack width="600px" py="10px">
              <InputControl
                placeholder=" "
                name="precioReserva"
                type="number"
                label="Precio de reserva"
                isRequired
              ></InputControl>
              <InputControl
                placeholder=" "
                name="precioSenia"
                type="number"
                label="Seña de reserva"
              ></InputControl>
            </HStack>
            <HStack py="10px">
              <CheckboxGroupControl name="dias">
                <HStack>
                  <Checkbox id="dias.Lunes" value="Lunes">
                    Lunes
                  </Checkbox>
                  <Checkbox id="dias.Martes" value="Martes">
                    Martes
                  </Checkbox>
                  <Checkbox id="dias.Miércoles" value="Miércoles">
                    Miércoles
                  </Checkbox>
                  <Checkbox id="dias.Jueves" value="Jueves">
                    Jueves
                  </Checkbox>
                  <Checkbox id="dias.Viernes" value="Viernes">
                    Viernes
                  </Checkbox>
                  <Checkbox id="dias.Sábado" value="Sábado">
                    Sábado
                  </Checkbox>
                  <Checkbox id="dias.Domingo" value="Domingo">
                    Domingo
                  </Checkbox>
                </HStack>
              </CheckboxGroupControl>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <SubmitButton>Aceptar</SubmitButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormProvider>
  );
}
