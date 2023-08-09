import { ApiError } from "@/utils/api";
import { Establecimiento } from "@/models";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  Alert,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import {
  CrearEstablecimientoReq,
  crearEstablecimiento,
} from "@/utils/api/establecimientos";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { InputControl, SelectControl, SubmitButton } from "@/components/forms";
import { useEffect, useState } from "react";

type FormState = CrearEstablecimientoReq & {
  imagen: File | undefined;
};

type provincias = {
  centroide: {};
  id: number;
  nombre: string;
};

type apiGobProv = {
  provincias: provincias[];
};

type localidades = { id: number; nombre: string };

type apiGobLoc = {
  municipios: localidades[];
};

const validationSchema = Yup.object({
  nombre: Yup.string().required("Obligatorio"),
  telefono: Yup.string().required("Obligatorio"),
  direccion: Yup.string().required("Obligatorio"),
  localidad: Yup.string().required("Obligatorio"),
  provincia: Yup.string().required("Obligatorio"),
  correo: Yup.string()
    .email("Formato de correo inválido")
    .required("Obligatorio"),
  idAdministrador: Yup.number().required(),
  horariosDeAtencion: Yup.string().optional(),
  imagen: Yup.mixed<File>().optional(),
});

function NewEstab() {
  const { currentAdmin } = useCurrentAdmin();
  const navigate = useNavigate();
  const toast = useToast();
  const { mutate, isError } = useMutation<Establecimiento, ApiError, FormState>(
    {
      mutationFn: ({ imagen, ...est }) => crearEstablecimiento(est, imagen),
      onSuccess: () => {
        toast({
          title: "Establecimiento creado.",
          description: `Establecimiento registrado correctamente.`,
          status: "success",
          isClosable: true,
        });
        navigate(-1);
      },
      onError: () => {
        toast({
          title: "Error al crear el establecimiento.",
          description: `Intente de nuevo.`,
          status: "error",
          isClosable: true,
        });
      },
    }
  );

  const [prov, setProv] = useState<provincias[]>([]);
  const [localidades, setLocalidades] = useState<localidades[]>([]);

  useEffect(() => {
    fetch("https://apis.datos.gob.ar/georef/api/provincias")
      .then((response) => response.json())
      .then((data: apiGobProv) => {
        setProv(data.provincias);
      });
  }, []);

  const methods = useForm<FormState>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      idAdministrador: Number(currentAdmin?.id),
    },
    mode: "onTouched",
  });

  useEffect(() => {
    fetch(
      `https://apis.datos.gob.ar/georef/api/municipios?provincia=${methods.watch(
        "provincia"
      )}&campos=nombre&max=150`
    )
      .then((response) => response.json())
      .then((data: apiGobLoc) => {
        //console.log(data.localidades)
        setLocalidades(data.municipios);
      });
  }, [methods.watch("provincia")]);

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue("imagen", e.target.files ? e.target.files[0] : undefined);
  };

  return (
    <div>
      <Heading size="xl" margin="50px" textAlign="center">
        Nuevo Establecimiento
      </Heading>

      <Container centerContent gap="25px">
        <FormProvider {...methods}>
          <VStack
            as="form"
            onSubmit={methods.handleSubmit((values) => mutate(values))}
            spacing="3"
            width="400px"
            m="auto"
          >
            <InputControl
              name="nombre"
              label="Nombre del establecimiento"
              placeholder="Nombre"
              isRequired
            />
            <InputControl
              name="correo"
              type="email"
              label="Correo del establecimiento"
              placeholder="abc@ejemplo.com"
              isRequired
            />
            <InputControl
              name="direccion"
              label="Dirección"
              placeholder="Dirección"
              isRequired
            />
            <HStack>
              <SelectControl
                name="localidad"
                label="Localidad"
                placeholder="Localidad"
                isRequired
                children={
                  localidades
                    ? localidades.map((e) => <option>{e.nombre}</option>)
                    : null
                }
              />
              <SelectControl
                name="provincia"
                label="Provincia"
                placeholder="Provincia"
                isRequired
                children={prov.map((e) => (
                  <option>{e.nombre}</option>
                ))}
              />
            </HStack>
            <InputControl
              name="telefono"
              label="Teléfono"
              placeholder="0..."
              type="tel"
              isRequired
            />
            <InputControl
              name="horariosDeAtencion"
              label="Horarios de Atención"
              placeholder="8:00-12:00"
            />
            <FormControl>
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

            <SubmitButton>Crear</SubmitButton>
            {isError && (
              <Alert status="error">
                Error al intentar registrar el establecimiento. Intente de nuevo
              </Alert>
            )}
          </VStack>
        </FormProvider>
      </Container>
    </div>
  );
}

export default NewEstab;
