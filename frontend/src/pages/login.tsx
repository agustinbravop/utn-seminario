import { useMutation } from "@tanstack/react-query";
import { Administrador } from "@/models/index";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { Heading, VStack, Alert } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputControl, SubmitButton } from "@/components/forms";
import { ApiError } from "@/utils/api";

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
  const { mutate, isError } = useMutation<Administrador, ApiError, LoginState>({
    mutationFn: ({ correoOUsuario, clave }) => login(correoOUsuario, clave),
    onSuccess: (admin) => navigate(`/admin/${admin.id}`),
  });

  const methods = useForm<LoginState>({
    resolver: yupResolver(validationSchema),
    defaultValues: { correoOUsuario: "", clave: "" },
    mode: "onTouched",
  });
  return (
    <>
      <Heading textAlign="center" size="2xl" margin={[0, "60px"]}>
        Bienvenido a CANCHAS.NET
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
          <SubmitButton>Iniciar Sesión</SubmitButton>

          {isError && (
            <Alert status="error" margin="20px">
              Error al intentar iniciar sesión. Intente de nuevo
            </Alert>
          )}
        </VStack>
      </FormProvider>
    </>
  );
}
