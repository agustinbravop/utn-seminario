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
import { FormProvider } from "react-hook-form";
import { GrAddCircle } from "react-icons/gr";
import { useYupForm } from "@/hooks";
import * as Yup from "yup";
import { DIAS, DISCIPLINAS, DURACION_RESERVA, HORAS } from "@/utils/consts";
import { EditIcon } from "@chakra-ui/icons";

const validationSchema = Yup.object({
  id: Yup.number().integer().positive().optional(),
  horaInicio: Yup.string().oneOf(HORAS),
  horaFin: Yup.string().oneOf(HORAS),
  minutosReserva: Yup.number().positive().integer(),
  disciplina: Yup.string(),
  dias: Yup.array(Yup.string().oneOf(DIAS)),
  precioReserva: Yup.number().integer().positive(),
  precioSenia: Yup.number().integer().positive().optional(),
});

interface FormDisponibilidadProps {
  onSubmit: (disp: DisponibilidadForm) => void;
  resetValues: DisponibilidadForm;
  variant: "crear" | "modificar";
}

export default function FormDisponibilidad({
  onSubmit,
  resetValues,
  variant,
}: FormDisponibilidadProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const methods = useYupForm<DisponibilidadForm>({
    validationSchema,
    resetValues,
  });

  console.log(methods.getValues());

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
              <SelectControl
                placeholder="Elegir horario"
                label="Horario de Inicio"
                name="horaInicio"
                isRequired
              >
                {HORAS.map((hora, i) => (
                  <option key={i} value={hora}>
                    {hora}
                  </option>
                ))}
              </SelectControl>
              <SelectControl
                placeholder="Elegir horario"
                label="Horario de Fin"
                name="horaFin"
                isRequired
              >
                {HORAS.map((hora, i) => (
                  <option key={i} value={hora}>
                    {hora}
                  </option>
                ))}
              </SelectControl>
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
                  <Checkbox value="Lunes">Lunes</Checkbox>
                  <Checkbox value="Martes">Martes</Checkbox>
                  <Checkbox value="Miércoles">Miércoles</Checkbox>
                  <Checkbox value="Jueves">Jueves</Checkbox>
                  <Checkbox value="Viernes">Viernes</Checkbox>
                  <Checkbox value="Sábado">Sábado</Checkbox>
                  <Checkbox value="Domingo">Domingo</Checkbox>
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
