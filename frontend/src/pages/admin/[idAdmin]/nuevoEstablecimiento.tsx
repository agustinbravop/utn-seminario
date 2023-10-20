import { useNavigate } from "react-router";
import {
  Alert,
  Button,
  Container,
  HStack,
  Heading,
  VStack,
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { CrearEstablecimiento, useCrearEstablecimiento } from "@/utils/api";
import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import {
  ImageControl,
  InputControl,
  SelectLocalidadControl,
  SelectProvinciaControl,
  SubmitButton,
} from "@/components/forms";
import { useEffect } from "react";
import { FormProvider, useWatch } from "react-hook-form";
import { useYupForm } from "@/hooks/useYupForm";

type FormState = CrearEstablecimiento & {
  imagen: File | undefined;
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

function NuevoEstablecimientoPage() {
  const { admin } = useCurrentAdmin();
  const navigate = useNavigate();
  const toast = useToast();

  const methods = useYupForm<FormState>({
    validationSchema,
    defaultValues: { idAdministrador: Number(admin?.id) },
  });

  const { mutate, isLoading, isError } = useCrearEstablecimiento({
    onSuccess: () => {
      toast({
        title: "Establecimiento creado.",
        description: `Establecimiento registrado correctamente.`,
        status: "success",
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al crear el establecimiento.",
        description: `Intente de nuevo.`,
        status: "error",
      });
    },
  });

  const provincia = useWatch({ name: "provincia", control: methods.control });
  useEffect(() => {
    methods.resetField("localidad");
  }, [provincia, methods]);

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
              <SelectProvinciaControl
                name="provincia"
                label="Provincia"
                isRequired
              />
              <SelectLocalidadControl
                name="localidad"
                label="Localidad"
                isRequired
                provincia={provincia}
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
            <ImageControl label="Imagen" name="imagen" />
            <HStack justifyContent="flex-end" spacing={30}>
              <Button onClick={() => navigate(-1)}>Cancelar</Button>
              <SubmitButton isLoading={isLoading}>Crear</SubmitButton>
            </HStack>
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

export default NuevoEstablecimientoPage;
