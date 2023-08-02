import { ApiError } from "@/utils/api";
import { Establecimiento } from "@/models";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@/router";
import {
  Alert,
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  ModificarEstablecimientoReq,
  getEstablecimientoByID,
  modificarEstablecimiento,
} from "@/utils/api/establecimientos";
import * as Yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputControl, SubmitButton } from "@/components/forms";
import EstabPage from "./_estabPage";

type FormState = ModificarEstablecimientoReq & {
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

export default function EditEstabPage() {
  const { idEst } = useParams("/ests/:idEst/editar");
  const navigate = useNavigate();
  const toast = useToast();

  const { data } = useQuery<Establecimiento>(["establecimientos", idEst], () =>
    getEstablecimientoByID(Number(idEst))
  );

  const methods = useForm<FormState>({
    resolver: yupResolver(validationSchema),
    defaultValues: async () => {
      return Promise.resolve({
        ...(data as Establecimiento),
        imagen: undefined,
      });
    },
    mode: "onTouched",
  });

  const { mutate, isError } = useMutation<Establecimiento, ApiError, FormState>(
    {
      mutationFn: ({ imagen, ...est }) => modificarEstablecimiento(est, imagen),
      onSuccess: () => {
        toast({
          title: "Establecimiento modificado",
          description: `Establecimiento modificado exitosamente.`,
          status: "success",
          isClosable: true,
        });
        navigate(-1);
      },
      onError: () => {
        toast({
          title: "Error al modificar el establecimiento",
          description: `Intente de nuevo.`,
          status: "error",
          isClosable: true,
        });
      },
    }
  );

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue("imagen", e.target.files ? e.target.files[0] : undefined);
  };

  return (
    <div>
      <EstabPage />

      <FormProvider {...methods}>
        <VStack
          as="form"
          onSubmit={methods.handleSubmit((values) => mutate(values))}
          spacing="4"
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
            <InputControl
              name="localidad"
              label="Localidad"
              placeholder="Localidad"
              isRequired
            />
            <InputControl
              name="provincia"
              label="Provincia"
              placeholder="Provincia"
              isRequired
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
          <SubmitButton>Guardar cambios</SubmitButton>
          {isError && (
            <Alert status="error">
              Error al intentar registrar el establecimiento. Intente de nuevo
            </Alert>
          )}
        </VStack>
      </FormProvider>
    </div>
  );
}
