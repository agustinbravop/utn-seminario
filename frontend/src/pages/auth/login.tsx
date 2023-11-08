import { useNavigate } from "react-router";
import * as Yup from "yup";
import {
  Heading,
  VStack,
  Alert,
  Text,
  Button,
  Icon,
  Box,
  Divider,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import {
  InputControl,
  PasswordControl,
  SubmitButton,
} from "@/components/forms";
import { GOOGLE_LOGIN_URL, useLogin } from "@/utils/api";
import { useYupForm } from "@/hooks/useYupForm";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const validationSchema = Yup.object({
  correoOUsuario: Yup.string().required("Obligatorio"),
  clave: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("Obligatorio"),
});

export default function LoginPage() {
  const navigate = useNavigate();

  const methods = useYupForm({
    validationSchema,
    defaultValues: { correoOUsuario: "", clave: "" },
  });

  const { mutate, isLoading, isError, error } = useLogin({
    onSuccess: (user) => {
      if (user.admin) {
        navigate(`/admin/${user.admin.id}`);
      } else {
        navigate(`/search`);
      }
    },
  });

  return (
    <>
      <Heading
        textAlign="center"
        size="2xl"
        fontSize="40px"
        mt="1.5em"
        mb="1em"
      >
        ¡Bienvenido a Play Finder!
      </Heading>

      <FormProvider {...methods}>
        <VStack
          as="form"
          onSubmit={methods.handleSubmit((values) => mutate(values))}
          spacing="24px"
          width={[
            "-webkit-fit-content", // 0-30em || mobile
            "400px", // 62em+ || pantalla escritorio
            //No contemplo medidas intermedias de tablets
          ]}
          m="1.5em auto"
        >
          <InputControl
            name="correoOUsuario"
            label="Correo o usuario"
            placeholder="Correo o usuario"
            isRequired
          />
          <PasswordControl
            name="clave"
            label="Contraseña"
            placeholder="Contraseña"
            isRequired
          />
          <SubmitButton isLoading={isLoading}>Iniciar Sesión</SubmitButton>
          {isError && (
            <Alert status="error">
              {error.status === 401
                ? "La contraseña ingresada es incorrecta."
                : error.status === 404
                ? "Ese correo o usuario no está registrado."
                : error.conflictMsg("Error al iniciar. Intente de nuevo.")}
            </Alert>
          )}
        </VStack>

        <Box position="relative">
          <Divider />
          <AbsoluteCenter bg="white" px="4">
            O con un proveedor
          </AbsoluteCenter>
        </Box>

        <VStack my="1.5em">
          <Link to={GOOGLE_LOGIN_URL}>
            <Button>
              {<Icon as={FcGoogle} boxSize={6} mr="0.3em" />}Iniciar sesión con
              Google
            </Button>
          </Link>
        </VStack>

        <Divider />

        <Text mt="1em" textAlign="center">
          ¿No tiene una cuenta?{" "}
          <Link to="/auth/register" style={{ color: "blue" }}>
            Registrarse
          </Link>
        </Text>
      </FormProvider>
    </>
  );
}
