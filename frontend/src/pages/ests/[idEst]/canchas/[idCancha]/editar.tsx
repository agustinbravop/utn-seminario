import React, { useEffect } from "react";
import { Cancha, Disponibilidad } from "@/models";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Alert,
  Container,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  ModificarCanchaReq,
  getCanchaByID,
  modificarCancha,
  deleteCanchaByID,
} from "@/utils/api/canchas";
import { InputControl, SubmitButton, SwitchControl } from "@/components/forms";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ApiError } from "@/utils/api";

type FormState = ModificarCanchaReq & {
  imagen: File | undefined;
};

const validationSchema = Yup.object({
  id: Yup.number().positive().required("Obligatorio"),
  nombre: Yup.string().required("Obligatorio"),
  descripcion: Yup.string().required("Obligatorio"),
  habilitada: Yup.bool().default(true),
  idEstablecimiento: Yup.number().required(),
  imagen: Yup.mixed<File>().optional(),
  disciplinas: Yup.array(Yup.string().required()).required("Obligatorio"),
  disponibilidades: Yup.array(Yup.mixed<Disponibilidad>().required()).default(
    []
  ),
});

// const horas = [
//   { value: "option1", label: "1:00hs" },
//   { value: "option2", label: "2:00hs" },
//   { value: "option3", label: "3:00hs" },
//   { value: "option4", label: "4:00hs" },
//   { value: "option5", label: "5:00hs" },
//   { value: "option6", label: "6:00hs" },
//   { value: "option7", label: "7:00hs" },
//   { value: "option8", label: "8:00hs" },
//   { value: "option9", label: "9:00hs" },
//   { value: "option10", label: "10:00hs" },
//   { value: "option11", label: "11:00hs" },
//   { value: "option12", label: "12:00hs" },
//   { value: "option13", label: "13:00hs" },
//   { value: "option14", label: "14:00hs" },
//   { value: "option15", label: "15:00hs" },
//   { value: "option16", label: "16:00hs" },
//   { value: "option17", label: "17:00hs" },
//   { value: "option18", label: "18:00hs" },
//   { value: "option19", label: "19:00hs" },
//   { value: "option20", label: "20:00hs" },
//   { value: "option21", label: "21:00hs" },
//   { value: "option22", label: "22:00hs" },
//   { value: "option23", label: "23:00hs" },
//   { value: "option24", label: "24:00hs" },
// ];

// const disciplinas = [
//   { value: "futbol", label: "Fútbol" },
//   { value: "basquetbol", label: "Básquetbol" },
//   { value: "tenis", label: "Tenis" },
//   { value: "natacion", label: "Natación" },
//   { value: "atletismo", label: "Atletismo" },
//   { value: "gimnasia", label: "Gimnasia" },
//   { value: "volleyball", label: "Volleyball" },
//   { value: "boxeo", label: "Boxeo" },
//   { value: "karate", label: "Karate" },
//   { value: "hockey", label: "Hockey" },
//   { value: "rugby", label: "Rugby" },
//   { value: "padel", label: "Pádel" },
//   { value: "squash", label: "Squash" },
//   { value: "beisbol", label: "Béisbol" },
//   { value: "softbol", label: "Softbol" },
// ];

export default function EditCourtPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { idEst, idCancha } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { data } = useQuery<Cancha>({
    queryKey: ["canchas", idCancha],
    queryFn: () => getCanchaByID(Number(idEst), Number(idCancha)),
    enabled: true,
  });

  const { mutate, isLoading, isError } = useMutation<
    Cancha,
    ApiError,
    FormState
  >({
    mutationFn: ({ imagen, ...cancha }) => modificarCancha(cancha, imagen),
    onSuccess: () => {
      toast({
        title: "Cancha modificada.",
        description: `Cancha modificada exitosamente.`,
        status: "success",
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al modificar la cancha",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  const methods = useForm<FormState>({
    resolver: yupResolver(validationSchema),
    defaultValues: async () => {
      return Promise.resolve({ ...(data as Cancha), imagen: undefined });
    },
    mode: "onTouched",
  });

  useEffect(() => {
    // Precargar el formulario con los datos actuales.
    methods.reset(data);
  }, [methods, data]);

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue("imagen", e.target.files ? e.target.files[0] : undefined);
  };

  const { mutate: mutateDelete } = useMutation<void, ApiError>({
    mutationFn: () => deleteCanchaByID(data?.idEstablecimiento, data?.id),
    onSuccess: () => {
      toast({
        title: "Cancha Eliminada.",
        description: `Cancha Eliminada exitosamente.`,
        status: "success",
        isClosable: true,
      });
      navigate(-2);
    },
    onError: () => {
      toast({
        title: "Error al eliminar la cancha",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  const handleEliminar = () => {
    mutateDelete();
    onClose();
  };

  return (
    <>
      <Heading m="40px" textAlign="center">
        Editar Cancha
      </Heading>
      <FormProvider {...methods}>
        <VStack
          as="form"
          onSubmit={methods.handleSubmit(onOpen)}
          spacing="24px"
          width="400px"
          m="auto"
        >
          <InputControl
            name="nombre"
            label="Nombre de la cancha"
            placeholder="Nombre"
            isRequired
          />
          <InputControl
            name="descripcion"
            label="Descripción"
            placeholder="Descripción"
            isRequired
          />
          <FormControl>
            <FormLabel marginTop="10px" marginLeft="10px">
              Imagen
            </FormLabel>
            <Input
              type="file"
              name="imagen"
              onChange={handleImagenChange}
              accept="image/*"
              sx={{
                "::file-selector-button": {
                  height: 10,
                  padding: 0,
                  mr: 4,
                  background: "none",
                  border: "none",
                  fontWeight: "bold",
                },
              }}
            />
          </FormControl>
          <FormControl>
            <SwitchControl
              name="habilitada"
              label="¿Esta habilitada?"
            ></SwitchControl>
          </FormControl>
          <Heading size="md" mt="20px">
            Disponibilidades horarias
          </Heading>
          <Text>
            En qué rangos horarios la cancha estará disponible y para qué
            disciplinas.
          </Text>
          <Button> Agregar disponibilidad +</Button>
          {/* <Button> Agregar disponibilidad +</Button>
          <VStack
            spacing="4"
            width="900px"
            justifyContent="center"
            margin="20px auto"
          >
            <HStack width="600px">
              <FormControl
                variant="floating"
                id="disciplinas"
                isRequired
                onChange={handleChange}
              >
                <Select name="disciplinas" placeholder="Seleccione una opcion">
                  {disciplinas.map((disciplina) => (
                    <option key={disciplina.value} value={disciplina.value}>
                      {disciplina.label}
                    </option>
                  ))}
                </Select>
                <FormLabel>Disciplina</FormLabel>
              </FormControl>
              <FormControl
                variant="floating"
                id="duracionreserva"
                isRequired
                onChange={handleChange}
              >
                <Input placeholder=" " name="duracionreserva" />
                <FormLabel>Duracion de la reserva</FormLabel>
              </FormControl>
            </HStack>
            <HStack width="600px">
              <FormControl
                variant="floating"
                id="hora-inicio"
                isRequired
                onChange={handleChange}
              >
                <Select placeholder="Seleccione una opcion">
                  {horas.map((hora) => (
                    <option key={hora.value} value={hora.value}>
                      {hora.label}
                    </option>
                  ))}
                </Select>
                <FormLabel>Hora inicio</FormLabel>
              </FormControl>
              <FormControl
                variant="floating"
                id="reserva"
                isRequired
                onChange={handleChange}
              >
                <Input placeholder=" " name="reserva" />
                <FormLabel>Precio de la reserva</FormLabel>
              </FormControl>
            </HStack>

            <HStack width="600px">
              <FormControl
                variant="floating"
                id="hora-fin"
                isRequired
                onChange={handleChange}
              >
                <Select placeholder="Seleccione una opcion">
                  {horas.map((hora) => (
                    <option key={hora.value} value={hora.value}>
                      {hora.label}
                    </option>
                  ))}
                </Select>
                <FormLabel>Hora fin</FormLabel>
              </FormControl>
              <FormControl
                variant="floating"
                id="precioseña"
                isRequired
                onChange={handleChange}
              >
                <Input placeholder=" " name="precioseña" />
                <FormLabel>Precio de la seña</FormLabel>
              </FormControl>
            </HStack>
          </VStack>
          <p> Seleccionar los días para la disponibilidad.</p>
          <HStack spacing={1} justify="center">
            <SelectableButton children="Lunes" />
            <SelectableButton children="Martes" />
            <SelectableButton children="Miercoles" />
            <SelectableButton children="Jueves" />
            <SelectableButton children="Viernes" />
            <SelectableButton children="Sabado" />
            <SelectableButton children="Domingo" />
          </HStack> */}
          <Container centerContent mt="20px">
            <SubmitButton isLoading={isLoading}>Modificar</SubmitButton>
            {isError && (
              <Alert status="error">
                Error al intentar registrar el establecimiento. Intente de nuevo
              </Alert>
            )}
          </Container>

          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modificar cancha</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                ¿Está seguro de modificar la información de la cancha?
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="gray" mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="blackAlpha"
                  backgroundColor="black"
                  onClick={methods.handleSubmit((values) => mutate(values))}
                >
                  Aceptar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
      </FormProvider>
    </>
  );
}
