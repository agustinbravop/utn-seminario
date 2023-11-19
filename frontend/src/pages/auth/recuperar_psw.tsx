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
import { useEnviarMail } from "@/utils/api";
import { FormProvider } from "react-hook-form";
import { InputControl, PasswordControl, SubmitButton } from "@/components/forms";
import { useNavigate } from "react-router";
import { useYupForm } from "@/hooks";

//Esto lo defino por facilidad, pero podría ser solo una parametro tipo String
type recuperarClave = {
  correo: string,
}

const validationSchema = Yup.object({
  correo: Yup.string().email()
});

export default function Recuperar_psw() {
  const toast = useToast();
  const navigate = useNavigate();

  const methods = useYupForm<recuperarClave>({ validationSchema });
  const { mutate, isLoading } = useEnviarMail({
    onSuccess: () => {
      toast({
        title: "Correo enviado",
        description: "Revise su correo para recuperar su contraseña.",
        status: "success",
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al intentar enviar el correo",
        description: "Intente de nuevo.",
        status: "error",
      });
    },
  });

  return (
    <Card m="auto" maxWidth="clamp(400px, 100%)" height="70%" mt="5%">
      <CardHeader>
        <Heading size="lg" textAlign="center">
          Recuperar contraseña
        </Heading>
      </CardHeader>
      <CardBody mt="28px">
        <FormProvider {...methods}>
          <Stack
            spacing="5"
            mt="-2rem"
            as="form"
            onSubmit={methods.handleSubmit((value) => mutate(value))}
          >
            <InputControl
              label="Correo"
              placeholder=" "
              name="correo"
              isRequired
            />
            <Center>
              <Button onClick={() => navigate(-1)} mr={15}>
                Cancelar
              </Button>
              <SubmitButton isLoading={isLoading}>Enviar correo</SubmitButton>
            </Center>
          </Stack>
        </FormProvider>
      </CardBody>
    </Card>
  );
}
