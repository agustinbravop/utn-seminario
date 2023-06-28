import "./LogIn.css";
import TopMenu from "../../components/TopMenu";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "../../utils/api";
import { Administrador } from "../../types";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { useCurrentAdmin } from "../../hooks/useCurrentAdmin";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Alert,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormik } from "formik";

interface LoginState {
  correoOUsuario: string;
  clave: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useCurrentAdmin();
  const { mutate, isLoading, isError } = useMutation<Administrador, ApiError, LoginState>({
    mutationFn: ({ correoOUsuario, clave }) => login(correoOUsuario, clave),
    onSuccess: (admin) => navigate(`/administrador/${admin.id}`),
  });

  const { values, errors, handleSubmit, handleChange } = useFormik<LoginState>({
    initialValues: {
      correoOUsuario: "",
      clave: "",
    },
    onSubmit: (values) => mutate(values),
    validationSchema: Yup.object({
      correoOUsuario: Yup.string().required("Obligatorio"),
      clave: Yup.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .required("Obligatorio"),
    }),
  });

  return (
    <>
      <TopMenu />

      <div className="page">
        <div className="contenedor">
          <Heading textAlign="center" size="2xl" margin={[0, "60px"]}>
            Bienvenido a CANCHAS.NET
          </Heading>
          <form className="formulario" onSubmit={handleSubmit}>
            <VStack spacing="24px" width="400px">
              <FormControl
                variant="floating"
                id="correoOUsuario"
                isRequired
                isInvalid={!!errors.correoOUsuario && !!values.correoOUsuario}
              >
                <Input
                  name="correoOUsuario"
                  value={values.correoOUsuario}
                  onChange={handleChange}
                  placeholder="Correo o usuario"
                />
                <FormLabel>Correo o usuario</FormLabel>
                <FormErrorMessage>{errors.correoOUsuario}</FormErrorMessage>
              </FormControl>
              <FormControl
                variant="floating"
                id="clave"
                isRequired
                isInvalid={!!errors.clave && !!values.clave}
              >
                <Input
                  name="clave"
                  value={values.clave}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  type="password"
                />
                <FormLabel>Contraseña</FormLabel>
                <FormErrorMessage>{errors.clave}</FormErrorMessage>
              </FormControl>

              <div className="centrado">
                <Button
                  type="submit"
                  className="btn btn-danger"
                  style={{ backgroundColor: "#FF604F" }}
                  isLoading={isLoading}
                >
                  Iniciar Sesión
                </Button>
                {isError && (
                  <Alert status="error" margin="20px">
                    Error al intentar iniciar sesión. Intente de nuevo
                  </Alert>
                )}
              </div>
            </VStack>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
