import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  useToast,
  Center,
  Button,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useSolicitarResetearClave } from "@/utils/api";
import { FormProvider } from "react-hook-form";
import { InputControl, SubmitButton } from "@/components/forms";
import { useNavigate } from "react-router";
import { useYupForm } from "@/hooks";

const validationSchema = Yup.object({
  correo: Yup.string().email("El correo debe ser válido"),
});

export default function Recuperar_psw() {
  const toast = useToast();
  const navigate = useNavigate();

  const methods = useYupForm({ validationSchema });
  const { mutate, isLoading, isSuccess } = useSolicitarResetearClave({
    onSuccess: () => {
      toast({
        title: "Correo de recuperación enviado.",
        description: "Revise tanto su spam como su bandeja de entrada.",
        status: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error al enviar el correo",
        description: "Intente de nuevo.",
        status: "error",
      });
    },
  });

  return (
    <Card m="auto" maxWidth="400px" h="70%" mt="5%">
      <CardHeader pb="0">
        <Heading size="lg" textAlign="center">
          Recuperar contraseña
        </Heading>
      </CardHeader>
      <CardBody>
        <Text pb="20px">
          Si te olvidaste la contraseña de tu cuenta, ingresá tu email y te
          enviaremos un correo electrónico para que puedas restablecerla.
        </Text>
        <FormProvider {...methods}>
          <Stack
            spacing="5"
            as="form"
            onSubmit={methods.handleSubmit(({ correo }) => mutate({ correo }))}
          >
            <InputControl
              label="Correo electrónico"
              placeholder="user@example.com"
              name="correo"
              isRequired
            />
            {isSuccess && (
              <Alert status="success">
                <AlertIcon />
                Correo de recuperación enviado.
              </Alert>
            )}
            <Center>
              <Button onClick={() => navigate(-1)} mr={15}>
                Cancelar
              </Button>
              <SubmitButton isLoading={isLoading} isDisabled={isSuccess}>
                Enviar correo
              </SubmitButton>
            </Center>
          </Stack>
        </FormProvider>
      </CardBody>
    </Card>
  );
}
