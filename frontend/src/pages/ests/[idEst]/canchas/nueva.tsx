import { Disponibilidad } from "@/models";
import { useNavigate, useParams } from "react-router";
import { Button, Heading, HStack, useToast, VStack } from "@chakra-ui/react";
import { CrearCancha, useCrearCancha } from "@/utils/api/canchas";
import { ImageControl, InputControl, SubmitButton } from "@/components/forms";
import { FormProvider } from "react-hook-form";
import * as Yup from "yup";
import { useYupForm } from "@/hooks";

type FormState = CrearCancha & {
  imagen: File | undefined;
};
const validationSchema = Yup.object({
  nombre: Yup.string().required("Obligatorio"),
  descripcion: Yup.string().required("Obligatorio"),
  habilitada: Yup.bool().default(true),
  idEstablecimiento: Yup.number().required(),
  imagen: Yup.mixed<File>().optional(),
  disponibilidades: Yup.array<Disponibilidad>().required().default([]),
});

export default function CanchaNuevaPage() {
  const { idEst } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const methods = useYupForm<FormState>({
    validationSchema,
    defaultValues: {
      nombre: "",
      descripcion: "",
      habilitada: true,
      idEstablecimiento: Number(idEst),
      imagen: undefined,
      disponibilidades: [],
    },
  });

  const { mutate, isLoading } = useCrearCancha({
    onSuccess: () => {
      toast({
        title: "Cancha creada",
        description: `Cancha creada exitosamente.`,
        status: "success",
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al crear la cancha",
        description: `Intente de nuevo.`,
        status: "error",
      });
    },
  });

  return (
    <>
      <Heading textAlign="center" mt="40px" paddingBottom="60px">
        Nueva cancha
      </Heading>

      <FormProvider {...methods}>
        <VStack
          as="form"
          onSubmit={methods.handleSubmit((values) => {
            mutate({
              ...values,
            });
          })}
          spacing="24px"
          width="800px"
          m="auto"
        >
          <VStack width="400px">
            <InputControl
              name="nombre"
              label="Nombre de la cancha"
              placeholder="Nombre"
              isRequired
            />
            <InputControl
              name="descripcion"
              label="Descripción"
              placeholder="Descripción"
              isRequired
            />
            <ImageControl label="Imagen" name="imagen" />
          </VStack>

          <HStack justifyContent="flex-end" spacing={30}>
            <Button onClick={() => navigate(-1)}>Cancelar</Button>
            <SubmitButton isLoading={isLoading}>Crear</SubmitButton>
          </HStack>
        </VStack>
      </FormProvider>
    </>
  );
}
