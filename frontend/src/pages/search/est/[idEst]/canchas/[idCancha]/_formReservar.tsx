import { SubmitButton } from "@/components/forms";
import DateControl from "@/components/forms/DateControl";
import { useYupForm } from "@/hooks";
import { Disponibilidad } from "@/models";
import { CrearReserva, useCrearReserva } from "@/utils/api";
import { formatearFecha } from "@/utils/dates";
import {
  useDisclosure,
  useToast,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Modal,
  VStack,
  Heading,
  Text,
  Box,
  HStack,
  Center,
} from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import * as Yup from "yup";

interface FormReservarDisponibilidadProps {
  disp: Disponibilidad;
}

const validationSchema = Yup.object({
  fechaReservada: Yup.string(),
  idDisponibilidad: Yup.number(),
});

export default function FormReservarDisponibilidad({
  disp,
}: FormReservarDisponibilidadProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const searchParams = new URLSearchParams(window.location.href);
  const date = searchParams.get("date")!;

  const { mutate, isLoading } = useCrearReserva({
    onSuccess: () => {
      toast({
        title: "Su reserva fue registrada",
        description: "Reserva creada exitosamente.",
        status: "success",
      });
    },
    onError: (error) => {
      toast({
        title: error.conflictMsg("Error al intentar crear la reserva"),
        description: "Intente de nuevo.",
        status: "error",
      });
    },
  });

  const methods = useYupForm<CrearReserva>({
    validationSchema,
    defaultValues: {
      idDisponibilidad: disp.id,
      fechaReservada: date || formatearFecha(new Date()),
    },
  });

  return (
    <>
      <Button size="sm" colorScheme="brand" onClick={onOpen} title="eliminar">
        Reservar
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <FormProvider {...methods}>
          <ModalContent
            as="form"
            onSubmit={methods.handleSubmit((values) => {
              mutate(values);
              onClose();
            })}
          >
            <ModalHeader>Reservar</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack>
                <Center flexDirection="column">
                  <Heading size="sm">Fecha a reservar</Heading>
                  <DateControl name="fechaReservada" />
                </Center>
                <HStack
                  justify="space-evenly"
                  width="100%"
                  flex="1"
                  wrap="wrap"
                >
                  <Box>
                    <Heading size="sm">Disciplina</Heading>
                    <Text>{disp.disciplina}</Text>
                  </Box>
                  <Box>
                    <Heading size="sm">Horario</Heading>
                    <Text>
                      {disp.horaInicio} - {disp.horaFin}hs
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="sm">Precio</Heading>
                    <Text>${disp.precioReserva}</Text>
                  </Box>
                  <Box>
                    <Heading size="sm">Seña</Heading>
                    <Text>
                      {disp.precioSenia
                        ? `$${disp.precioSenia}`
                        : "No requiere señar"}
                    </Text>
                  </Box>
                </HStack>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <SubmitButton isLoading={isLoading}>Aceptar</SubmitButton>
            </ModalFooter>
          </ModalContent>
        </FormProvider>
      </Modal>
    </>
  );
}
