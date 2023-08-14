import { Administrador } from "@/models";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Box,
  VStack,
  useToast,
  useDisclosure,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useParams } from "@/router";
import { editarPerfil, getAdminById } from "@/utils/api/administrador";
import { useQuery } from "@tanstack/react-query";
import useMutationForm from "@/hooks/useMutationForm";
import { ApiError } from "@/utils/api";
import { FormProvider } from "react-hook-form";
import { InputControl, SubmitButton } from "@/components/forms";
import { useNavigate } from "react-router";

type FormState = Administrador;

const validationSchema = Yup.object({
  id: Yup.number(),
  nombre: Yup.string().required("Debe ingresar su nombre"),
  apellido: Yup.string().required("Debe ingresar su apellido"),
  telefono: Yup.string().required("Debe ingresar su telefono"),
  correo: Yup.string().email("Formato erroneo").required("Debe tener un correo"),
  usuario: Yup.string().required("Debe ingresar un nombre de usuario"),
  tarjeta: Yup.object({
    id: Yup.number(),
    nombre: Yup.string(),
    numero: Yup.string(),
    cvv: Yup.number(),
    vencimiento: Yup.string(),
  }),
  suscripcion: Yup.object({
    id: Yup.number(),
    nombre: Yup.string(),
    limiteEstablecimientos: Yup.number(),
    costoMensual: Yup.number(),
  }),
});

export default function PerfilPage() {
  const { idAdmin } = useParams("/admin/:idAdmin/perfil");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();


  const { data, isLoading } = useQuery<Administrador>({
    queryKey: ["administrador", idAdmin],
    queryFn: () => getAdminById(Number(idAdmin)),
    enabled: true,
  });

  const { methods, mutate } = useMutationForm<
    Administrador,
    ApiError,
    FormState
  >({
    resetValues: data,
    mutationFn: (admin) => editarPerfil(admin),
    validationSchema,
    onSuccess: () => {
      toast({
        title: "Perfil actualizado",
        description: `Perfil actualizado exitosamente.`,
        status: "success",
        isClosable: true,
      });
      navigate(-1)
    },
    onError: () => {
      toast({
        title: "Error al intentar editar el perfil",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  return (
    <>
      <VStack>
        <Card
          // justifyContent="center"
          boxSize="40rem"
          width="40%"
          height="70%"
          // marginLeft="32%"
          marginTop="5%"
        >
          <CardHeader>
            <Heading size="lg" textAlign="center">
              Editar Perfil
            </Heading>
          </CardHeader>
          <CardBody marginTop="28px">
            <FormProvider {...methods}>
              <Stack
                divider={<StackDivider />} 
                spacing="2.5"
                marginTop="-2rem"
                as="form"
                onSubmit={methods.handleSubmit(onOpen)}
              >
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Nombre
                  </Heading>
                  <InputControl
                    isRequired
                    name="nombre"
                  />
                  <br />
                  <InputControl
                    isRequired
                    name="apellido"
                  />
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    usuario
                  </Heading> 
                  <InputControl
                    isRequired
                    name="usuario"
                  />
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    correo
                  </Heading>
                  <InputControl
                    isRequired
                    name="correo"
                  />
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    telefono
                  </Heading>
                  <InputControl
                    isRequired
                    name="telefono"
                  />
                </Box>
                <SubmitButton isLoading={isLoading}>
                  Guardar cambios
                </SubmitButton>
                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Modificar</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      ¿Está seguro de modificar la información de su
                      perfil?
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="gray" mr={3} onClick={onClose}>
                        Cancelar
                      </Button>
                      <Button
                        colorScheme="brand"
                        backgroundColor="black"
                        onClick={methods.handleSubmit((values) =>
                          mutate(values)
                        )}
                      >
                        Aceptar
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Stack>
            </FormProvider>
          </CardBody>
        </Card>
      </VStack>
    </>
  );
}
