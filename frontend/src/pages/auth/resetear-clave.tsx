import { Navigate, useLocation, useNavigate } from "react-router";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useResetearClave } from "@/utils/api";
import { PasswordControl, SubmitButton } from "@/components/forms";
import { useYupForm } from "@/hooks";
import { FormProvider } from "react-hook-form";
import * as Yup from "yup";

const validationSchema = Yup.object({
  nueva: Yup.string().min(8, "Debe tener al menos ocho caracteres"),
  renueva: Yup.string()
    .min(1, "Mínimo ocho caracteres")
    .required("Repita su contraseña.")
    .oneOf([Yup.ref("nueva")], "Las contraseñas no coinciden"),
});

// El correo de "restablecer contraseña" redirige a esta página.
export default function ResetearClavePage() {
  const navigate = useNavigate();
  const toast = useToast();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // El parámetro `code` tiene un código de Google que le sirve al back para loguear al usuario.
  const token = searchParams.get("token");
  const correo = searchParams.get("correo");

  const methods = useYupForm({ validationSchema });
  const { mutate, isLoading } = useResetearClave({
    onSuccess: () => {
      toast({
        title: "Contraseña reestablecida.",
        description: "Recuérdela de manera segura.",
        status: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error al restablecer la contraseña",
        description: "Intente de nuevo.",
        status: "error",
      });
    },
  });

  if (!token || !correo) {
    return <Navigate to="/404" />;
  }

  return (
    <Card m="auto" maxWidth="400px" h="70%" mt="5%">
      <CardHeader pb="0">
        <Heading size="lg" textAlign="center">
          Restablecer contraseña
        </Heading>
      </CardHeader>
      <CardBody>
        <Text pb="20px">
          Ingrese una contraseña nueva para su cuenta. Debe tener al menos ocho
          caracteres y ser distinta a la anterior.
        </Text>
        <FormProvider {...methods}>
          <Stack
            spacing="5"
            as="form"
            onSubmit={methods.handleSubmit(({ nueva }) =>
              mutate({ nueva, token, correo })
            )}
          >
            <PasswordControl
              label="Contraseña nueva"
              placeholder=" "
              name="nueva"
              isRequired
            />
            <PasswordControl
              label="Repetir contraseña"
              placeholder=" "
              name="renueva"
              isRequired
            />
            <Center>
              <Button onClick={() => navigate(-1)} mr={15}>
                Cancelar
              </Button>
              <SubmitButton isLoading={isLoading}>Reestablecer</SubmitButton>
            </Center>
          </Stack>
        </FormProvider>
      </CardBody>
    </Card>
  );
}
