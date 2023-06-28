import "./NewEstab.css";
import TopMenu from "../../components/TopMenu/TopMenu";
import { ApiError, crearEstablecimiento } from "../../utils/api";
import { Establecimiento } from "../../types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import {
  Alert,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

type FormState = Establecimiento & {
  imagen?: File;
};

function NewEstab() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { mutate, isLoading, isError } = useMutation<
    Establecimiento,
    ApiError,
    FormState
  >({
    mutationFn: ({ imagen, ...admin }) => crearEstablecimiento(admin, imagen),
    onSuccess: () => {
      toast({
        title: "Establecimiento creado.",
        description: `Establecimiento registrado correctamente.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al crear el establecimiento.",
        description: `Intente de nuevo.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const { values, setValues, errors, handleSubmit, handleChange } =
    useFormik<FormState>({
      initialValues: {
        id: 0,
        nombre: "",
        telefono: "",
        direccion: "",
        localidad: "",
        provincia: "",
        urlImagen: "",
        correo: "",
        idAdministrador: Number(id),
        horariosDeAtencion: "",
        imagen: undefined,
      },
      onSubmit: (values) => mutate(values),
      validationSchema: Yup.object({
        nombre: Yup.string().required("Obligatorio"),
        telefono: Yup.string().required("Obligatorio"),
        direccion: Yup.string().required("Obligatorio"),
        localidad: Yup.string().required("Obligatorio"),
        provincia: Yup.string().required("Obligatorio"),
        correo: Yup.string()
          .email("Formato de correo inválido")
          .required("Obligatorio"),
      }),
    });

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      imagen: e.target.files ? e.target.files[0] : undefined,
    });
  };

  return (
    <div className="page">
      <TopMenu />
      <div className="centrado">
        <Heading size="xl" margin="50px">
          Nuevo Establecimiento
        </Heading>
      </div>

      <form onSubmit={handleSubmit}>
        <Container centerContent gap="25px">
          <VStack spacing="4">
            <FormControl
              variant="floating"
              id="nombre"
              isRequired
              isInvalid={!!errors.nombre && !!values.nombre}
            >
              <Input
                onChange={handleChange}
                value={values.nombre}
                name="nombre"
                placeholder="Nombre"
              />
              <FormLabel>Nombre del establecimiento</FormLabel>
              <FormErrorMessage>{errors.nombre}</FormErrorMessage>
            </FormControl>
            <FormControl
              variant="floating"
              id="correo"
              isRequired
              isInvalid={!!errors.correo && !!values.correo}
            >
              <Input
                onChange={handleChange}
                value={values.correo}
                name="correo"
                type="email"
                placeholder="abc@ejemplo.com"
              />
              <FormLabel>Correo del establecimiento</FormLabel>
              <FormErrorMessage>{errors.correo}</FormErrorMessage>
            </FormControl>
            <FormControl
              variant="floating"
              id="direccion"
              isRequired
              isInvalid={!!errors.direccion && !!values.direccion}
            >
              <Input
                onChange={handleChange}
                value={values.direccion}
                name="direccion"
                placeholder="Dirección"
              />
              <FormLabel>Dirección</FormLabel>
              <FormErrorMessage>{errors.direccion}</FormErrorMessage>
            </FormControl>
            <HStack>
              <FormControl
                variant="floating"
                id="localidad"
                isRequired
                isInvalid={!!errors.localidad && !!values.localidad}
              >
                <Input
                  onChange={handleChange}
                  value={values.localidad}
                  name="localidad"
                  placeholder="Localidad"
                />
                <FormLabel>Localidad</FormLabel>
                <FormErrorMessage>{errors.localidad}</FormErrorMessage>
              </FormControl>
              <FormControl
                variant="floating"
                id="provincia"
                isRequired
                isInvalid={!!errors.provincia && !!values.provincia}
              >
                <Input
                  onChange={handleChange}
                  value={values.provincia}
                  name="provincia"
                  placeholder="Provincia"
                />
                <FormLabel>Provincia</FormLabel>
                <FormErrorMessage>{errors.provincia}</FormErrorMessage>
              </FormControl>
            </HStack>
            <FormControl
              variant="floating"
              id="telefono"
              isRequired
              isInvalid={!!errors.telefono && !!values.telefono}
            >
              <Input
                onChange={handleChange}
                value={values.telefono}
                name="telefono"
                placeholder="Teléfono"
                type="tel"
              />
              <FormLabel>Teléfono</FormLabel>
              <FormErrorMessage>{errors.telefono}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormControl variant="floating" id="horariosDeAtencion">
                <Input
                  onChange={handleChange}
                  value={values.horariosDeAtencion}
                  name="horariosDeAtencion"
                  placeholder="8:00-12:00"
                  type="text"
                />
                <FormLabel>Horarios de Atención</FormLabel>
                <FormErrorMessage>{errors.horariosDeAtencion}</FormErrorMessage>
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

            <Button
              type="submit"
              className="btn btn-danger"
              isLoading={isLoading}
            >
              Crear
            </Button>
            {isError && (
              <Alert status="error">
                Error al intentar registrar su cuenta. Intente de nuevo
              </Alert>
            )}
          </VStack>
        </Container>
      </form>
    </div>
  );
}

export default NewEstab;
