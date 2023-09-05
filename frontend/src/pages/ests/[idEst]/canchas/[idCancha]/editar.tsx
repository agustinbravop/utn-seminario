import React from "react";
import { Disponibilidad } from "@/models";
import { useNavigate, useParams } from "react-router";
import {
  Alert,
  Container,
  FormHelperText,
  HStack,
  Heading,
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
  useCanchaByID,
  useModificarCancha,
} from "@/utils/api/canchas";
import { InputControl, SubmitButton, SwitchControl } from "@/components/forms";
import { FormProvider } from "react-hook-form";
import { useYupForm } from "@/hooks";
import * as Yup from "yup";

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

export default function EditCourtPage() {
  const {
    isOpen: confirmIsOpen,
    onOpen: confirmOnOpen,
    onClose: confirmOnClose,
  } = useDisclosure();
  const { idEst, idCancha } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { data } = useCanchaByID(Number(idEst), Number(idCancha));

  const { mutate, isLoading, isError } = useModificarCancha({
    onSuccess: () => {
      toast({
        title: "Cancha modificada.",
        description: "Cancha modificada exitosamente.",
        status: "success",
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al modificar la cancha",
        description: "Intente de nuevo.",
        status: "error",
        isClosable: true,
      });
    },
  });

  const methods = useYupForm<FormState>({
    validationSchema,
    resetValues: data,
  });

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue("imagen", e.target.files ? e.target.files[0] : undefined);
  };

  return (
    <>
      <Heading m="40px" textAlign="center">
        Editar Cancha
      </Heading>
      <FormProvider {...methods}>
        <VStack
          as="form"
          onSubmit={methods.handleSubmit(confirmOnOpen)}
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
            <SwitchControl name="habilitada" label="¿Habilitada?" />
            <FormHelperText m="0">
              Una cancha deshabilitada no puede ser reservada por jugadores.
            </FormHelperText>
          </FormControl>

          <Container centerContent mt="10px">
            <HStack justifyContent="flex-end" spacing={30}>
              <Button onClick={() => navigate(-1)}>Cancelar</Button>
              <SubmitButton isLoading={isLoading}>Modificar</SubmitButton>
            </HStack>
            {isError && (
              <Alert status="error">
                Error al intentar registrar el establecimiento. Intente de
                nuevo.
              </Alert>
            )}
          </Container>

          <Modal isOpen={confirmIsOpen} onClose={confirmOnClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modificar cancha</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                ¿Está seguro de modificar la información de la cancha?
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="gray" mr={3} onClick={confirmOnClose}>
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
