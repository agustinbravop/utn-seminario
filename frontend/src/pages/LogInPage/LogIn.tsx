import "./LogIn.css";
import TopMenu from "../../components/TopMenu";
import { Fragment, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "../../utils/api";
import { Administrador } from "../../types";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCurrentAdmin } from "../../hooks/useCurrentAdmin";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Alert,
} from "@chakra-ui/react";

interface LoginState {
  correoOUsuario: string;
  clave: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useCurrentAdmin();
  const [state, setState] = useState<LoginState>({
    correoOUsuario: "",
    clave: "",
  });

  const { mutate, isError } = useMutation<Administrador, ApiError, LoginState>({
    mutationFn: ({ correoOUsuario, clave }) => login(correoOUsuario, clave),
    onSuccess: (admin) => navigate(`/administrador/${admin.id}`),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    console.log(state);
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validation()) {
      console.log("Error!");
    }
    mutate(state);
  };

  const advertencia = (message: string) => {
    toast.warning(message, {
      position: "top-center",
      autoClose: 5000,
      progress: 1,
      closeOnClick: true,
      hideProgressBar: false,
      draggable: true,
    });
  };

  const validation = () => {
    if (!state.correoOUsuario) {
      advertencia("El campo Usuario no puede estar vacio");
      return false;
    } else if (!state.clave) {
      advertencia("El campo contraseña no puede estar vacio");
      return false;
    }
    return true;
  };

  return (
    <Fragment>
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
                onChange={handleChange}
              >
                <Input placeholder="Correo o usuario" name="correoOUsuario" />
                <FormLabel>Correo o usuario</FormLabel>
              </FormControl>
              <FormControl
                variant="floating"
                id="clave"
                isRequired
                onChange={handleChange}
              >
                <Input placeholder="Contraseña" name="clave" type="password" />
                <FormLabel>Contraseña</FormLabel>
              </FormControl>

              <div className="centrado">
                <Button
                  type="submit"
                  className="btn btn-danger"
                  style={{ backgroundColor: "#FF604F" }}
                >
                  Iniciar Sesión
                </Button>
                {isError && (
                  <Alert status="error" margin="20px">
                    Datos incorrectos. Intente de nuevo
                  </Alert>
                )}
              </div>
            </VStack>
          </form>
        </div>
      </div>
      <ToastContainer />
    </Fragment>
  );
}

export default LoginPage;
