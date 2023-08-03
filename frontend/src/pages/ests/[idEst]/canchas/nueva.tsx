import React from "react";
import { Cancha } from "@/models";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/utils/api";
import {
  Alert,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { CrearCanchaReq, crearCancha } from "@/utils/api/canchas";
import { InputControl, SubmitButton } from "@/components/forms";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type FormState = CrearCanchaReq & {
  imagen: File | undefined;
};

const validationSchema = Yup.object({
  nombre: Yup.string().required("Obligatorio"),
  descripcion: Yup.string().required("Obligatorio"),
  estaHabilitada: Yup.bool().default(true),
  idEstablecimiento: Yup.number().required(),
  imagen: Yup.mixed<File>().optional(),
  disciplinas: Yup.array(Yup.string().required()).required("Obligatorio"),
});

function NewCourt() {
  const { idEst } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { mutate, isError } = useMutation<Cancha, ApiError, FormState>({
    mutationFn: ({ imagen, ...cancha }) => crearCancha(cancha, imagen),
<<<<<<< HEAD:frontend/src/pages/NewCourt/NewCourt.tsx
    onSuccess: () => navigate(-1),
=======
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
>>>>>>> cb21ec71928a91a894bf903e885b7ac2e93d2196:frontend/src/pages/ests/[idEst]/canchas/nueva.tsx
  });

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue("imagen", e.target.files ? e.target.files[0] : undefined);
  };

  const methods = useForm<FormState>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      estaHabilitada: true,
      idEstablecimiento: Number(idEst),
      imagen: undefined,
      disciplinas: [],
    },
    mode: "onTouched",
  });

  return (
    <div>
      <Heading textAlign="center" mt="40px" paddingBottom="60px" >
        Nueva cancha
      </Heading>
      <FormProvider {...methods}>
        <VStack
          as="form"
          onSubmit={methods.handleSubmit((values) => mutate(values))}
          spacing="24px"
          width="400px"
          m="auto"
        >
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
          <SubmitButton>Crear</SubmitButton>
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

export default NewCourt;

/*
<div className="margen">
            <h3>Disponibilidad horaria</h3>
            <p> En qué rangos horarios la cancha estará disponible y para qué disciplinas.</p>
            {isError && (
              <Alert status="error" margin="20px">
                Datos incorrectos. Intente de nuevo
              </Alert>
            )}
            <Button > Agregar disponibilidad + </Button>
          </div>
            <br/>
          <VStack spacing="4" width="900px" justifyContent="center" margin="auto">
            <HStack width="600px">
              <FormControl
                variant="floating"
                id="nombre"
                isRequired
                onChange={handleChange}>
                <Select placeholder='Seleccione una opcion'>
                {disciplinas.map((disciplina) => (
                  <option key={disciplina.value} value={disciplina.value}>
                    {disciplina.label}
                  </option>))
              }
              </Select>
                <FormLabel>Disciplina</FormLabel>
              </FormControl>
              <FormControl
                variant="floating"
                id="duracionreserva"
                isRequired
                onChange={handleChange}>
                <Input placeholder=" " name="duracionreserva" />
                <FormLabel>Duracion de la reserva</FormLabel>
              </FormControl>
            </HStack>
            <HStack width="600px">
              <FormControl
                variant="floating"
                id="hora-inicio"
                isRequired
                onChange={handleChange}>
                <Select placeholder='Seleccione una opcion'>
                {horas.map((hora) => (
                  <option key={hora.value} value={hora.value}>
                    {hora.label}
                  </option>))
                  }
                </Select>
                <FormLabel>Hora inicio</FormLabel>
              </FormControl>
              <FormControl
                variant="floating"
                id="reserva"
                isRequired
                onChange={handleChange}>
                <Input placeholder=" " name="reserva" />
                <FormLabel>Precio de la reserva</FormLabel>
              </FormControl>
            </HStack>
          
            <HStack width="600px">
              <FormControl
                variant="floating"
                id="hora-fin"
                isRequired
                onChange={handleChange}>
                <Select placeholder='Seleccione una opcion'>
                {horas.map((hora) => (
                  <option key={hora.value} value={hora.value}>
                    {hora.label}
                  </option>))
                }
              </Select>
                <FormLabel>Hora fin</FormLabel>
              </FormControl>
              <FormControl
                variant="floating"
                id="precioseña"
                isRequired
                onChange={handleChange}>
                <Input placeholder=" " name="precioseña" />
                <FormLabel>Precio de la seña</FormLabel>
              </FormControl>
            </HStack>
          </VStack>
          <div className="margen">
            <p> Seleccionar los días para  la disponibilidad.</p>
          </div>
            <br/>
          <div className="centrado2">
            <SelectableButton children= 'Lunes'/>
            <SelectableButton children= 'Martes'/>
            <SelectableButton children= 'Miercoles'/>
            <SelectableButton children= 'Jueves'/>
            <SelectableButton children= 'Viernes'/>
            <SelectableButton children= 'Sabado'/>
            <SelectableButton children= 'Domingo'/>
          </div>
            <br/>
            <br/>

          <div className="centrado">
          */
