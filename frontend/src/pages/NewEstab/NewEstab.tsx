import "./NewEstab.css";
import TopMenu from "../../components/TopMenu";
import { ApiError, crearEstablecimiento } from "../../utils/api";
import { Establecimiento } from "../../types";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

type FormState = Establecimiento & {
  imagen?: File;
};

function NewEstab() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<FormState>({
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
  });

  const { mutate } = useMutation<Establecimiento, ApiError, FormState>({
    mutationFn: ({ imagen, ...admin }) => crearEstablecimiento(admin, imagen),
    onSuccess: () => navigate(-1),
  });

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
    mutate(state);
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
              id="clave"
              isRequired
              onChange={handleChange}
            >
              <Input name="nombre" placeholder="Nombre" />
              <FormLabel>Nombre del establecimiento</FormLabel>
            </FormControl>
            <FormControl
              variant="floating"
              id="correo"
              isRequired
              onChange={handleChange}
            >
              <Input name="correo" type="email" placeholder="abc@ejemplo.com" />
              <FormLabel>Correo del establecimiento</FormLabel>
            </FormControl>
            <FormControl
              variant="floating"
              id="direccion"
              isRequired
              onChange={handleChange}
            >
              <Input name="direccion" placeholder="Dirección" />
              <FormLabel>Dirección</FormLabel>
            </FormControl>
            <HStack>
              <FormControl
                variant="floating"
                id="localidad"
                isRequired
                onChange={handleChange}
              >
                <Input name="localidad" placeholder="Localidad" />
                <FormLabel>Localidad</FormLabel>
              </FormControl>
              <FormControl
                variant="floating"
                id="provincia"
                isRequired
                onChange={handleChange}
              >
                <Input name="provincia" placeholder="Provincia" />
                <FormLabel>Provincia</FormLabel>
              </FormControl>
            </HStack>
            <FormControl
              variant="floating"
              id="telefono"
              isRequired
              onChange={handleChange}
            >
              <Input name="telefono" placeholder="Teléfono" type="tel" />
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

          <Button type="submit" className="btn btn-danger">
            Crear
          </Button>
        </Container>
      </form>
    </div>
  );
}

export default NewEstab;
