import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  useToast,
  Center,
  Button,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { CambiarClave, useCambiarClave } from "@/utils/api";
import { FormProvider } from "react-hook-form";
import { PasswordControl, SubmitButton } from "@/components/forms";
import { useNavigate } from "react-router";
import { useYupForm } from "@/hooks";

const validationSchema = Yup.object({
  actual: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("Obligatorio"),
  nueva: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("Obligatorio"),
});

export default function JugadorCambiarClavePage() {
  const toast = useToast();
  const navigate = useNavigate();

  const methods = useYupForm<CambiarClave>({ validationSchema });
  const { mutate, isLoading } = useCambiarClave({
    onSuccess: () => {
      toast({
        title: "Contraseña actualizada",
        description: "Contraseña actualizada exitosamente.",
        status: "success",
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al intentar cambiar la contraseña",
        description: "Intente de nuevo.",
        status: "error",
      });
    },
  });

  return (
    <Card m="auto" maxWidth="clamp(400px, 100%)" height="70%" mt="5%">
      <CardHeader>
        <Heading size="lg" textAlign="center">
          Cambiar contraseña
        </Heading>
      </CardHeader>
      <CardBody mt="28px">
        <FormProvider {...methods}>
          <Stack
            spacing="5"
            mt="-2rem"
            as="form"
            onSubmit={methods.handleSubmit((values) => mutate(values))}
          >
            <PasswordControl
              label="Clave actual"
              placeholder=" "
              name="actual"
              isRequired
            />
            <PasswordControl
              label="Clave nueva"
              placeholder=" "
              name="nueva"
              helperText="Debe tener 8 o más caracteres."
              isRequired
            />
            <Center>
              <Button onClick={() => navigate(-1)} mr={15}>
                Cancelar
              </Button>
              <SubmitButton isLoading={isLoading}>Guardar</SubmitButton>
            </Center>
          </Stack>
        </FormProvider>
      </CardBody>
    </Card>
  );
}
