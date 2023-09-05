import React from "react";
import { Disponibilidad } from "@/models";
import { useNavigate, useParams } from "react-router";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { CrearCanchaReq, useCrearCancha } from "@/utils/api/canchas";
import { InputControl, SubmitButton } from "@/components/forms";
import { FormProvider } from "react-hook-form";
import * as Yup from "yup";
import { useYupForm } from "@/hooks";

type FormState = CrearCanchaReq & {
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

export default function NuevaCanchaPage() {
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
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al crear la cancha",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue("imagen", e.target.files ? e.target.files[0] : undefined);
  };

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
