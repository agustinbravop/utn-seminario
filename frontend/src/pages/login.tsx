import { useNavigate } from "react-router";
import * as Yup from "yup";
import { Heading, VStack, Alert, Text } from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import {
  InputControl,
  PasswordControl,
  SubmitButton,
} from "@/components/forms";
import { useLogin } from "@/utils/api/auth";
import { useYupForm } from "@/hooks/useYupForm";
import { Link } from "react-router-dom";

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

  const { mutate, isLoading, isError } = useLogin({
    onSuccess: (user) => {
      if (user.admin) {
        navigate(`/admin/${user.admin.id}`);
      } else {
        navigate(`/jugador/${user.jugador.id}`);
      }
    },
  });

  return (
    <>
      <Heading
        textAlign="center"
        size="2xl"
        fontSize="40px"
        marginTop="100px"
        marginBottom="60px"
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
          m="auto"
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
            <Alert status="error" margin="20px">
              Error al intentar iniciar sesión. Contraseña o usuario incorrecto.
            </Alert>
          )}
          <Text>
            ¿No tiene una cuenta?{" "}
            <Link to="/register" style={{ color: "blue" }}>
              Registrarse
            </Link>
          </Text>
        </VStack>
      </FormProvider>
    </>
  );
}
