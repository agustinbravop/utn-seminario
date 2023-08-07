import React, { ChangeEvent, useEffect, useState } from "react";
import { Cancha } from "@/models";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/utils/api";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { CrearCanchaReq, crearCancha } from "@/utils/api/canchas";
import { InputControl, SubmitButton } from "@/components/forms";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SelectableButton from "@/components/SelectableButton/SelectableButton";

type FormState = CrearCanchaReq & {
  imagen: File | undefined;
};

const validationSchema = Yup.object({
  nombre: Yup.string().required("Obligatorio"),
  descripcion: Yup.string().required("Obligatorio"),
  estaHabilitada: Yup.bool().default(true),
  idEstablecimiento: Yup.number().required(),
  disciplinas: Yup.array(Yup.string().required()).required("Obligatorio"),
  imagen: Yup.mixed<File>().optional(),
});

function NewCourt() {
  const { idEst } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // Aca dejo hardcodeadas algunas disciplinas :|
  const disciplinas = ["Basket", "Futbol", "Tenis", "Padel"];

  //Horarios hardcodeados, no se si seria lo mejor
  //Si igual lo dejamos asi, mejor armar un for
  const horas = [
    "1:00",
    "2:00",
    "3:00",
    "4:00",
    "5:00",
    "6:00",
    "7:00",
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  const [disp, setDisp] = useState({
    horaInicio: "",
    horaFin: "",
    minutosReserva: 0,
    precioReserva: 0,
    precioSena: 0,
    disciplina: "",
    dias: [""],
  });

  const handleDiaSelect = (dia: string) => {
    if (disp.dias.includes(dia)) {
      const a = disp.dias.filter((e) => e !== dia);
      setDisp({ ...disp, dias: a });
    } else {
      const a = disp.dias;
      a.push(dia);
      setDisp({ ...disp, dias: a });
    }
    // console.log(disp);
  };

  const [state, setState] = useState<FormState>({
    nombre: "",
    descripcion: "",
    estaHabilitada: true,
    idEstablecimiento: Number(idEst),
    imagen: undefined,
    disciplinas: [],
  });

  const handleChangeState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  useEffect(() => {
    console.log(state);
  }, [state]);

  useEffect(() => {
    console.log(disp);
  }, [disp]);

  const handleChangeDisp = (e: ChangeEvent<HTMLInputElement>) => {
    setDisp({ ...disp, [e.target.name]: e.target.value });
  };

  const { mutate, isLoading } = useMutation<Cancha, ApiError, FormState>({
    mutationFn: ({ imagen, ...cancha }) => crearCancha(cancha, disp, imagen),
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

  const methods = useForm<FormState>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      estaHabilitada: true,
      idEstablecimiento: Number(idEst),
      disciplinas: [],
      imagen: undefined,
    },
    mode: "onTouched",
  });

  return (
    <div>
      <Heading textAlign="center" mt="40px" paddingBottom="60px">
        Nueva cancha
      </Heading>
      <FormProvider {...methods}>
        <VStack
          as="form"
          onSubmit={methods.handleSubmit((values) => console.log(values))}
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

          <div className="margen">
            <h3>Disponibilidad horaria</h3>
            <p>
              {" "}
              En qué rangos horarios la cancha estará disponible y para qué
              disciplinas.
            </p>
            <Button> Agregar disponibilidad + </Button>
          </div>
          <br />

          <HStack width="600px">
            <FormControl variant="floating" id="hora-inicio" isRequired>
              <Select placeholder="Elegir Horario" name="horaInicio">
                {horas.map((hora, i) => (
                  <option key={i} value={hora}>
                    {hora}
                  </option>
                ))}
              </Select>
              <FormLabel>Hora inicio</FormLabel>
            </FormControl>
            <FormControl variant="floating" id="hora-fin" isRequired>
              <Select placeholder="Elegir Horario" name="horaFin">
                {horas.map((hora, i) => (
                  <option key={i} value={hora}>
                    {hora}
                  </option>
                ))}
              </Select>
              <FormLabel>Hora fin</FormLabel>
            </FormControl>
          </HStack>
          <HStack width="600px">
            <FormControl variant="floating" id="nombre" isRequired>
              <Select placeholder="Seleccione una opcion" name="disciplina">
                {disciplinas.map((disciplina, i) => (
                  <option key={i} value={disciplina}>
                    {disciplina}
                  </option>
                ))}
              </Select>
              <FormLabel>Disciplina</FormLabel>
            </FormControl>
            <FormControl variant="floating" id="duracionReserva" isRequired>
              <Input placeholder=" " name="minutosReserva" />
              <FormLabel>Duracion de una reserva</FormLabel>
            </FormControl>
          </HStack>
          <HStack width="600px">
            <FormControl variant="floating" id="reserva" isRequired>
              <Input placeholder=" " name="precioReserva" />
              <FormLabel>Precio de la reserva</FormLabel>
            </FormControl>
            <FormControl variant="floating" id="precioSena">
              <Input placeholder=" " name="precioSena" />
              <FormLabel>Precio de la seña</FormLabel>
            </FormControl>
          </HStack>

          <div>
            <p> Seleccionar los días para la disponibilidad.</p>
          </div>
          <br />
          <div className="centrado2">
            <SelectableButton
              children="Lunes"
              onButtonClick={handleDiaSelect}
            />
            <SelectableButton
              children="Martes"
              onButtonClick={handleDiaSelect}
            />
            <SelectableButton
              children="Miercoles"
              onButtonClick={handleDiaSelect}
            />
            <SelectableButton
              children="Jueves"
              onButtonClick={handleDiaSelect}
            />
            <SelectableButton
              children="Viernes"
              onButtonClick={handleDiaSelect}
            />
            <SelectableButton
              children="Sabado"
              onButtonClick={handleDiaSelect}
            />
            <SelectableButton
              children="Domingo"
              onButtonClick={handleDiaSelect}
            />
          </div>
          <br />
          <SubmitButton isLoading={isLoading}>Crear</SubmitButton>
        </VStack>
      </FormProvider>
    </div>
  );
}

export default NewCourt;
