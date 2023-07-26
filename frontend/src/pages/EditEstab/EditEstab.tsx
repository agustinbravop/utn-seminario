import { ApiError } from "@utils/api";
import { Establecimiento } from "@models";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  ModificarEstablecimientoReq,
  getEstablecimientoByID,
  modificarEstablecimiento,
} from "@utils/api/establecimientos";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

type FormState = ModificarEstablecimientoReq & {
  imagen?: File;
};

function EditEstab() {
  const { idAdmin, idEst } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState<FormState>({
    id: Number(idEst),
    nombre: "",
    telefono: "",
    direccion: "",
    localidad: "",
    provincia: "",
    correo: "",
    idAdministrador: Number(idAdmin),
    horariosDeAtencion: "",
    imagen: undefined,
  });

  const toast = useToast();
  const advertencia = (message: string) => {
    toast({
      title: message,
      status: "success",
      isClosable: true,
    });
  };

  const validacion = () => {
    let result = false;
    if ((state.nombre === "" || state.nombre === null) && result === false) {
      result = true;
      advertencia("El establecimiento debe tener un nombre");
    }
    if (
      (state.telefono === "" || state.telefono === null) &&
      result === false
    ) {
      result = true;
      advertencia("El establecimiento debe tener un telefono");
    }
    if (
      (state.direccion === "" || state.direccion === null) &&
      result === false
    ) {
      result = true;
      advertencia("El campo Dirección no puede estar vacio");
    }
    if (
      (state.provincia === "" || state.provincia === null) &&
      result === false
    ) {
      result = true;
      advertencia("El campo Provincia no puede estar vacio");
    }
    if (
      (state.localidad === "" || state.localidad === null) &&
      result === false
    ) {
      result = true;
      advertencia("El campo Localidad no puede estar vacio");
    }

    if ((state.correo === "" || state.correo === null) && result === false) {
      result = true;
      advertencia("El establecimiento debe tener correo electronico");
    }
    if (
      (state.horariosDeAtencion === "" || state.horariosDeAtencion === null) &&
      result === false
    ) {
      result = true;
      advertencia("Los horarios deben estar definidos");
    }

    return result;
  };

  const toastC = useToast();
  const { mutate, isLoading } = useMutation<
    Establecimiento,
    ApiError,
    FormState
  >({
    mutationFn: ({ imagen, ...est }) => modificarEstablecimiento(est, imagen),
    onSuccess: () => {
      toastC({
        title: "Cancha modificada",
        description: `Cancha modificada exitosamente.`,
        status: "success",
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toastC({
        title: "Error al modificar la cancha",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  useQuery<Establecimiento>(["establecimientos", idEst], () =>
    getEstablecimientoByID(Number(idEst))
  );

  useEffect(() => {
    const cargarEstablecimiento = async () => {
      const e = await getEstablecimientoByID(Number(idEst));
      console.log(e);

      setState({ ...e, imagen: undefined });
    };
    cargarEstablecimiento();
  }, [idEst]);

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      imagen: e.target.files ? e.target.files[0] : undefined,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form State:", state);
    if (!validacion()) {
      mutate(state);
    }
  };

  return (
    <div>
      <div>
        <Heading size="xl" margin="50px">
          Editar Establecimiento
        </Heading>
      </div>

      <form onSubmit={handleSubmit}>
        <Container centerContent gap="25px">
          <VStack spacing="4">
            <FormControl
              variant="floating"
              id="nombre"
              isRequired
              onChange={handleChange}
            >
              <Input name="nombre" placeholder="Nombre" value={state.nombre} />
              <FormLabel>Nombre del establecimiento</FormLabel>
            </FormControl>
            <FormControl
              variant="floating"
              id="correo"
              isRequired
              onChange={handleChange}
            >
              <Input
                name="correo"
                type="email"
                placeholder="abc@ejemplo.com"
                value={state.correo}
              />
              <FormLabel>Correo del establecimiento</FormLabel>
            </FormControl>
            <FormControl
              variant="floating"
              id="direccion"
              isRequired
              onChange={handleChange}
            >
              <Input
                name="direccion"
                placeholder="Dirección"
                value={state.direccion}
              />
              <FormLabel>Dirección</FormLabel>
            </FormControl>
            <HStack>
              <FormControl
                variant="floating"
                id="localidad"
                isRequired
                onChange={handleChange}
              >
                <Input
                  name="localidad"
                  placeholder="Localidad"
                  value={state.localidad}
                />
                <FormLabel>Localidad</FormLabel>
              </FormControl>
              <FormControl
                variant="floating"
                id="provincia"
                isRequired
                onChange={handleChange}
              >
                <Input
                  name="provincia"
                  placeholder="Provincia"
                  value={state.provincia}
                />
                <FormLabel>Provincia</FormLabel>
              </FormControl>
            </HStack>
            <FormControl
              variant="floating"
              id="telefono"
              isRequired
              onChange={handleChange}
            >
              <Input
                name="telefono"
                placeholder="Teléfono"
                type="tel"
                value={state.telefono}
              />
              <FormLabel>Teléfono</FormLabel>
            </FormControl>
            <FormControl>
              <FormControl
                variant="floating"
                id="horariosDeAtencion"
                onChange={handleChange}
              >
                <Input
                  name="horariosDeAtencion"
                  placeholder="8:00-12:00"
                  type="text"
                  value={state.horariosDeAtencion}
                />
                <FormLabel>Horarios de Atención</FormLabel>
              </FormControl>
              <FormLabel marginTop="10px" marginLeft="10px">
                Imagen
              </FormLabel>
              <Input
                type="file"
                name="imagen"
                onChange={handleImagenChange}
                accept="image/*"
                sx={{
                  "::file-selector-button": {
                    height: 10,
                    padding: 0,
                    mr: 4,
                    background: "none",
                    border: "none",
                    fontWeight: "bold",
                  },
                }}
              />
            </FormControl>
          </VStack>

          <div>
            <Container centerContent mt="20px">
              <Button type="submit">
                {!isLoading ? "Guardar cambios" : "Guardando..."}
              </Button>
              <br />
              {isLoading && <LoadingSpinner />}
            </Container>
          </div>
        </Container>
      </form>
    </div>
  );
}

export default EditEstab;
