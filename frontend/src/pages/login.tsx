import { Administrador } from "@/models/index";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { Heading, VStack, Alert } from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import { InputControl, SubmitButton } from "@/components/forms";
import { ApiError } from "@/utils/api";
import { useMutationForm } from "@/hooks/useMutationForm";

interface LoginState {
  correoOUsuario: string;
  clave: string;
}

const validationSchema = Yup.object({
  correoOUsuario: Yup.string().required("Obligatorio"),
  clave: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("Obligatorio"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useCurrentAdmin();
  const { methods, mutate, isLoading, isError } = useMutationForm<
    Administrador,
    ApiError,
    LoginState
  >({
    validationSchema,
    defaultValues: { correoOUsuario: "", clave: "" },
    mutationFn: ({ correoOUsuario, clave }) => login(correoOUsuario, clave),
    onSuccess: (admin) => navigate(`/admin/${admin.id}`),
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
          width="400px"
          m="auto"
        >
          <InputControl
            name="correoOUsuario"
            label="Correo o usuario"
            placeholder="Correo o usuario"
            isRequired
          />
          <InputControl
            name="clave"
            type="password"
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
        </VStack>
      </FormProvider>
    </>
  );
}
