import { useNavigate, useParams } from "@/router";
import {
  Alert,
  HStack,
  Heading,
  VStack,
  useToast,
  Button,
} from "@chakra-ui/react";
import {
  ModificarEstablecimiento,
  useEstablecimientoByID,
  useModificarEstablecimiento,
} from "@/utils/api";
import * as Yup from "yup";
import { FormProvider, useWatch } from "react-hook-form";
import {
  ImageControl,
  InputControl,
  ConfirmSubmitButton,
  SelectProvinciaControl,
  SelectLocalidadControl,
} from "@/components/forms";
import { useYupForm } from "@/hooks/useYupForm";
import { useEffect } from "react";

type FormState = ModificarEstablecimiento & {
  imagen: File | undefined;
};

const validationSchema = Yup.object({
  id: Yup.number().required("Obligatorio"),
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

export default function EstablecimientoEditarPage() {
  const navigate = useNavigate();
  const { idEst } = useParams("/ests/:idEst");
  const toast = useToast();

  const { data } = useEstablecimientoByID(Number(idEst));

  const methods = useYupForm<FormState>({
    validationSchema,
    resetValues: data,
  });

  const { mutate, isLoading, isError } = useModificarEstablecimiento({
    onSuccess: () => {
      toast({
        title: "Establecimiento modificado",
        description: `Establecimiento modificado exitosamente.`,
        status: "success",
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al modificar el establecimiento",
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
      <Heading textAlign="center" mt="40px" pb="60px">
        Editar Establecimiento
      </Heading>
      <FormProvider {...methods}>
        <VStack as="form" spacing="4" width="400px" m="auto">
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
          <ImageControl
            label="Imagen"
            name="imagen"
            defaultImg={data?.urlImagen}
          />

          <HStack justifyContent="flex-end" spacing={30}>
            <Button onClick={() => navigate(-1)}>Cancelar</Button>
            <ConfirmSubmitButton
              isLoading={isLoading}
              onSubmit={methods.handleSubmit((values) => mutate(values))}
              header="Modificar establecimiento"
              body="¿Está seguro de modificar la información del establecimiento?"
            >
              Guardar
            </ConfirmSubmitButton>
          </HStack>

          {isError && (
            <Alert status="error">
              Error al intentar guardar los cambios. Intente de nuevo
            </Alert>
          )}
        </VStack>
      </FormProvider>
    </div>
  );
}
