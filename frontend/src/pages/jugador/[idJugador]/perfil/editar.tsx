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
  Center,
  Button,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useModificarJugador } from "@/utils/api/auth";
import { FormProvider } from "react-hook-form";
import { InputControl, ConfirmSubmitButton } from "@/components/forms";
import { useNavigate } from "react-router";
import { useCurrentJugador, useYupForm } from "@/hooks";

const validationSchema = Yup.object({
  id: Yup.number(),
  nombre: Yup.string().required("Debe ingresar su nombre"),
  apellido: Yup.string().required("Debe ingresar su apellido"),
  telefono: Yup.string().required("Debe ingresar su telefono"),
  correo: Yup.string()
    .email("Formato erroneo")
    .required("Debe tener un correo"),
  usuario: Yup.string().required("Debe ingresar un nombre de usuario"),
});

export default function PerfilPage() {
  const toast = useToast();
  const navigate = useNavigate();

  const { jugador } = useCurrentJugador();

  const methods = useYupForm({ validationSchema, resetValues: jugador });
  const { mutate, isLoading } = useModificarJugador({
    onSuccess: () => {
      toast({
        title: "Perfil actualizado",
        description: "Perfil actualizado exitosamente.",
        status: "success",
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al intentar editar el perfil",
        description: "Intente de nuevo.",
        status: "error",
      });
    },
  });

  return (
    <>
      <VStack>
        <Card boxSize="40rem" width="40%" height="70%" marginTop="5%">
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
              >
                <Box>
                  <Heading size="xs">Nombre</Heading>
                  <InputControl isRequired name="nombre" />
                </Box>
                <Box>
                  <Heading size="xs">Apellido</Heading>
                  <InputControl isRequired name="apellido" />
                </Box>
                <Box>
                  <Heading size="xs">Usuario</Heading>
                  <InputControl isRequired name="usuario" />
                </Box>
                <Box>
                  <Heading size="xs">Correo</Heading>
                  <InputControl isRequired name="correo" />
                </Box>
                <Box>
                  <Heading size="xs">Teléfono</Heading>
                  <InputControl isRequired name="telefono" />
                </Box>
                <Center>
                  <Button onClick={() => navigate(-1)} mr={15}>
                    Cancelar
                  </Button>
                  <ConfirmSubmitButton
                    header="Modificar"
                    body="¿Está seguro de modificar la información de su perfil?"
                    onSubmit={methods.handleSubmit((values) => mutate(values))}
                    isLoading={isLoading}
                  >
                    Guardar
                  </ConfirmSubmitButton>
                </Center>
              </Stack>
            </FormProvider>
          </CardBody>
        </Card>
      </VStack>
    </>
  );
}
